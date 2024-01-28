<?php

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookHandled;

use App\Repositories\CdnRepository;

use App\Repositories\PlanRepository;

use App\Repositories\UserRepository;

use Illuminate\Support\Facades\Notification;

use App\Notifications\Subscription\User\Subscribed;

use App\Notifications\Subscription\User\StartTrial;

use App\Notifications\Subscription\User\SubscriptionScheduledCancelation;

use App\Notifications\Subscription\User\CancelSubscription;

use App\Notifications\Subscription\User\AccountUpgraded;

use App\Notifications\Subscription\User\AccountDowngraded;

use App\Notifications\Subscription\User\SubscriptionScheduledDowngradation;

use Symfony\Component\HttpFoundation\Response;

class StripeEventListenerAfterCashier
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
     * @param  \Laravel\Cashier\Events\WebhookHandled  $event
     * @return void
     */
    public function handle(WebhookHandled $event)
    {
        if(isset($event->payload['type'])) {

            if ($event->payload['type'] == 'customer.subscription.deleted') {

                if(isset($event->payload['data']['object']['id']) && $event->payload['data']['object']['id']) {

                    $subscription_id = $event->payload['data']['object']['id'];

                    $subscription = \App\Models\Subscription::where('stripe_id', $subscription_id)->first();

                    if($subscription) {

                        $user = \App\Models\User::where('id', $subscription->user_id)->first();

                        if($user) {

                            //Check if still another subscription have like [LTD]
                            $ltd_subscription = UserRepository::getActiveSubscription($user);

                            if(!$ltd_subscription) {

                                //Switch user to free plan & deactivate cdn
                                $user->is_free = 1;
                                $user->cdn_active = 0;
                                $user->save();

                                //Convert all websites to free and disabled CDN
                                $this->cdnRepository->convertAllWebsiteToFree($user);

                                $plan = $this->planRepository->getPlanByPrice($subscription->stripe_price);

                                if($plan) {
                                    //Notification
                                    Notification::sendNow($user, new CancelSubscription($subscription, $plan));
                                }

                            }

                        }

                        //Cancel subscription
                        $subscription->stripe_status = 'cancelled';
                        $subscription->save();

                    }

                }
            } else if ($event->payload['type'] == 'customer.subscription.updated') {

                if(isset($event->payload['data']['object']['id']) && $event->payload['data']['object']['id']) {

                    $subscription_id = $event->payload['data']['object']['id'];

                    $subscription = \App\Models\Subscription::where('stripe_id', $subscription_id)->first();

                    if($subscription && $subscription->name != "default") {

                        $user = \App\Models\User::where('id', $subscription->user_id)->first();

                        if($user) {

                            if($subscription && $subscription->ends_at != null) {

                                $plan = $this->planRepository->getPlanByPrice($subscription->stripe_price);

                                if($plan) {
                                    //Notification
                                    Notification::sendNow($user, new SubscriptionScheduledCancelation($subscription, $plan));
                                }

                            }

                            if(isset($event->payload['data']['object']['plan']) && $event->payload['data']['object']['plan'] && isset($event->payload['data']['previous_attributes']['plan']) && $event->payload['data']['previous_attributes']['plan']) {

                                $previous_plan = $this->planRepository->getPlanByPrice($event->payload['data']['previous_attributes']['plan']['id']);

                                $plan = $this->planRepository->getPlanByPrice($event->payload['data']['object']['plan']['id']);

                                if($plan->price > $previous_plan->price) {
                                    //Upgrade notification
                                    Notification::sendNow($user, new AccountUpgraded($subscription, $previous_plan, $plan, $event->payload));
                                } else if($plan->price < $previous_plan->price && ($plan->months != $previous_plan->months)) {
                                    //Downgrade notification
                                    Notification::sendNow($user, new AccountDowngraded($subscription, $previous_plan, $plan));
                                } else if($plan->price < $previous_plan->price && ($plan->months == $previous_plan->months)) {
                                    //Downgrade notification and schedule
                                    Notification::sendNow($user, new SubscriptionScheduledDowngradation($subscription, $previous_plan, $plan, $event->payload));
                                }

                                //Update subscription product name
                                $subscription->name = $plan->stripe_subscription_id;
                                $subscription->save();

                            }

                            if ($user->is_free == 1) {
                                $user->is_free = 0;
                                $user->cdn_active = 1;
                                $user->save();
                            }

                        }

                    } else {
                        $subscription->forceDelete();
                    }

                }
            } else if ($event->payload['type'] == 'customer.subscription.created') {

                if(isset($event->payload['data']['object']['id']) && $event->payload['data']['object']['id'] && isset($event->payload['data']['object']['latest_invoice']) && $event->payload['data']['object']['latest_invoice']) {

                    $subscription_id = $event->payload['data']['object']['id'];

                    $subscription = \App\Models\Subscription::where('stripe_id', $subscription_id)->first();

                    if($subscription && $subscription->name != "default") {

                        $user = \App\Models\User::where('id', $subscription->user_id)->first();

                        if($user) {

                            $paymentMethod = $user->defaultPaymentMethod();

                            $invoice = $user->findInvoice($event->payload['data']['object']['latest_invoice']);

                            $plan = $this->planRepository->getPlanByPrice($subscription->stripe_price);

                            if($plan) {

                                if($subscription->stripe_status == 'active') {
                                    //Notification
                                    Notification::sendNow($user, new Subscribed($subscription, $plan, $invoice, $paymentMethod));
                                } else if($subscription->stripe_status == 'trialing') {
                                    //Notification
                                    Notification::sendNow($user, new StartTrial($subscription, $plan, $paymentMethod));
                                }

                                //Update subscription product name
                                $subscription->name = $plan->stripe_subscription_id;
                                $subscription->save();

                            }

                            if ($user->is_free == 1) {
                                $user->is_free = 0;
                                $user->cdn_active = 1;
                                $user->save();
                            }
                        }
                    } else {
                        $subscription->forceDelete();
                    }
                }
            } else if (in_array($event->payload['type'], ['customer.created', 'customer.updated']) && isset($event->payload['data']['object']['email']) && $event->payload['data']['object']['email']) {

                $token = \Str::random(60);

                $parts = explode(" ", $event->payload['data']['object']['name'], 2);

                $first_name = isset($parts[0]) && $parts[0] ? $parts[0] : '';

                $last_name = isset($parts[1]) && $parts[1] ? $parts[1] : '';

                $last_name = count($parts) == 3 ? $last_name.' '.$parts[2] : $last_name;

                $user = \App\Models\User::where('email', $event->payload['data']['object']['email'])->first();

                if(!$user) {
                    /*$user =  \App\Models\User::create([
                        'first_name' => $first_name,
                        'last_name' => $last_name,
                        'name' => $first_name.' '.$last_name,
                        'email' => $event->payload['data']['object']['email'],
                        'stripe_id' => $event->payload['data']['object']['id'],
                        'phone' => $event->payload['data']['object']['phone'],
                        'status' => "active",
                        'email_verified_at' => \Carbon\Carbon::now(),
                        'api_token' => hash('sha256', $token),
                    ]);*/
                } else {
                    $user->stripe_id = $event->payload['data']['object']['id'];
                    $user->first_name = $first_name;
                    $user->last_name = $last_name;
                    $user->name = $first_name.' '.$last_name;
                    $user->phone = $event->payload['data']['object']['phone'];
                    $user->save();
                }

            }

            //Payment logs
            if(in_array($event->payload['type'], ['customer.subscription.deleted', 'customer.subscription.updated', 'customer.subscription.created', 'customer.created', 'customer.updated'])) {
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
