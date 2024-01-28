<?php

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookReceived;

use App\Repositories\CdnRepository;

use App\Repositories\PlanRepository;

use Illuminate\Support\Facades\Notification;

use App\Notifications\Subscription\User\PaymentSuccessfull;

use App\Notifications\Cdn\User\PaymentSuccessfull as CdnPaymentSuccessfull;

use App\Notifications\Subscription\User\PaymentFailed;

use App\Notifications\Cdn\User\PaymentFailed as CdnPaymentFailed;

use App\Notifications\Cdn\User\AutoRechargePaymentFailed;

use Symfony\Component\HttpFoundation\Response;

class StripeEventListenerBeforeCashier
{

    protected $cdnRepository;

    protected $planRepository;

    /**
     * __construct
     *
     * @param  mixed $cdnRepository
     * @param  mixed $planRepository
     * @return void
     */
    public function __construct(CdnRepository $cdnRepository, PlanRepository $planRepository)
    {
        $this->cdnRepository = $cdnRepository;
        $this->planRepository = $planRepository;
    }

    /**
     * Handle received Stripe webhooks.
     *
     * @param  \Laravel\Cashier\Events\WebhookReceived  $event
     * @return void
     */
    public function handle(WebhookReceived $event)
    {
        if(isset($event->payload['type'])) {

            if ($event->payload['type'] == 'invoice.payment_succeeded') {

                sleep(5);

                $payment = \App\Models\BillingHistory::where('invoice_id', $event->payload['data']['object']['id'])->first();

                if($payment) {

                    //Cdn payments
                    $payment->status = 'succeeded';
                    $payment->invoice_id = $event->payload['data']['object']['id'];
                    $payment->amount_due = ($event->payload['data']['object']['amount_due'] / 100);
                    $payment->amount_paid = ($event->payload['data']['object']['amount_paid'] / 100);
                    $payment->amount_remaining = ($event->payload['data']['object']['amount_remaining'] / 100);
                    $payment->hosted_invoice_url = $event->payload['data']['object']['hosted_invoice_url'];
                    $payment->plan_title = isset($event->payload['data']['object']['lines']['data'][0]['description']) ? $event->payload['data']['object']['lines']['data'][0]['description'] : '';
                    $payment->start_date = isset($event->payload['data']['object']['lines']['data'][0]['period']['start']) && $event->payload['data']['object']['lines']['data'][0]['period']['start'] ? \Carbon\Carbon::createFromTimestamp($event->payload['data']['object']['lines']['data'][0]['period']['start'])->toDateTimeString() : \Carbon\Carbon::now()->toDateString();
                    $payment->end_date = isset($event->payload['data']['object']['lines']['data'][0]['period']['end']) && $event->payload['data']['object']['lines']['data'][0]['period']['end'] ? \Carbon\Carbon::createFromTimestamp($event->payload['data']['object']['lines']['data'][0]['period']['end'])->toDateTimeString() : \Carbon\Carbon::now()->toDateString();
                    $payment->payload = $event->payload;
                    $payment->save();

                    //Reset auto recharge alert
                    $user = \App\Models\User::where('id', $payment->user_id)->first();

                    if($user) {

                        $user->cdn_low_balance_alert_at = null;
                        $user->cdn_low_balance_alert_count = 0;
                        $user->cdn_auto_recharge_failed_count = 0;
                        $user->save();

                        //Payment notification
                        $plan = $this->planRepository->getPlan($payment->plan_id);

                        //payment_card
                        $paymentMethod = $user->defaultPaymentMethod();

                        //Notification
                        Notification::sendNow($user, new CdnPaymentSuccessfull($paymentMethod, $event->payload, $plan));
                    }

                } else {

                    if($event->payload['data']['object']['amount_paid'] > 0) {

                        $subscription = \App\Models\Subscription::where('stripe_id', $event->payload['data']['object']['subscription'])->first();

                        if($subscription) {

                            $plan = PlanRepository::getPlanByPrice($event->payload['data']['object']['lines']['data'][0]['plan']['id']);

                            $user = \App\Models\User::where('id', $subscription->user_id)->first();

                            \App\Models\BillingHistory::create([
                                "user_id" => $subscription->user_id,
                                "plan_id" => ($plan ? $plan->id : null),
                                "invoice_id" => $event->payload['data']['object']['id'],
                                "type" => 'subscription',
                                "transaction_id" => $event->payload['data']['object']['payment_intent'],
                                "amount_due" => ($event->payload['data']['object']['amount_due'] / 100),
                                "amount_paid" => $event->payload['data']['object']['amount_paid'] / 100,
                                "amount_remaining" => $event->payload['data']['object']['amount_remaining'] / 100,
                                "hosted_invoice_url" => $event->payload['data']['object']['hosted_invoice_url'],
                                "plan_title" => $event->payload['data']['object']['lines']['data'][0]['description'],
                                "start_date" => isset($event->payload['data']['object']['lines']['data'][0]['period']['start']) && $event->payload['data']['object']['lines']['data'][0]['period']['start'] ? \Carbon\Carbon::createFromTimestamp($event->payload['data']['object']['lines']['data'][0]['period']['start'])->toDateTimeString() : \Carbon\Carbon::now()->toDateString(),
                                "end_date" => isset($event->payload['data']['object']['lines']['data'][0]['period']['end']) && $event->payload['data']['object']['lines']['data'][0]['period']['end'] ? \Carbon\Carbon::createFromTimestamp($event->payload['data']['object']['lines']['data'][0]['period']['end'])->toDateTimeString() : \Carbon\Carbon::now()->toDateString(),
                                "payload" => $event->payload,
                                "status" => 'succeeded'
                            ]);

                            $subscription->failed_attempt = 0;

                            $subscription->save();

                            //payment_card
                            $paymentMethod = $user->defaultPaymentMethod();

                            //Notification
                            Notification::sendNow($user, new PaymentSuccessfull($subscription, $plan, $paymentMethod, $event->payload));
                        }

                    }

                }
            } else if ($event->payload['type'] == 'invoice.payment_failed') {

                //Subscription failed
                if(isset($event->payload['data']['object']['subscription']) && $event->payload['data']['object']['subscription']) {

                    $subscription_id = $event->payload['data']['object']['subscription'];

                    $subscription = \App\Models\Subscription::where('stripe_id', $subscription_id)->first();

                    $plan = PlanRepository::getPlanByPrice($event->payload['data']['object']['lines']['data'][0]['plan']['id']);

                    if($subscription) {

                        $user = \App\Models\User::where('id', $subscription->user_id)->first();

                        $subscription->failed_attempt = ($subscription->failed_attempt + 1);

                        $subscription->save();

                        if($subscription->failed_attempt >= 3) {
                            if($user) {
                                //Cancel subscription
                                $user->subscription($subscription->name)->cancelNow();
                            }
                        }

                        //payment_card
                        $paymentMethod = $user->defaultPaymentMethod();

                        //Notification
                        Notification::sendNow($user, new PaymentFailed($subscription, $plan, $paymentMethod, $event->payload));
                    }
                }

                //Cdn recharge failed
                if(isset($event->payload['data']['object']['lines']['data'][0]['description']) && $event->payload['data']['object']['lines']['data'][0]['description'] == "CDN Recharge") {

                    sleep(5);

                    $payment = \App\Models\BillingHistory::where('invoice_id', $event->payload['data']['object']['id'])->first();

                    if($payment) {

                        $user = \App\Models\User::where('id', $payment->user_id)->first();

                        if($user) {
                            $plan = $this->planRepository->getPlan($payment->plan_id);

                            //payment_card
                            $paymentMethod = $user->defaultPaymentMethod();

                            //Notification
                            if($payment->cdn_auto_recharge == 1) {
                                Notification::sendNow($user, new AutoRechargePaymentFailed($paymentMethod, $event->payload, $plan));
                            } else {
                                Notification::sendNow($user, new CdnPaymentFailed($paymentMethod, $event->payload, $plan));
                            }
                        }

                    }

                }

            }

            //Payment logs
            if(in_array($event->payload['type'], ['invoice.payment_succeeded', 'invoice.payment_failed'])) {
                \App\Models\PaymentLog::create([
                    'provider' => 'stripe',
                    'action' => $event->payload['type'],
                    'payload' => $event->payload
                ]);
            }

            return new Response('Webhook Handled', 200);

        }
    }
}
