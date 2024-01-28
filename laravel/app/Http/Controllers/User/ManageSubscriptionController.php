<?php

namespace App\Http\Controllers\User;

use App\Repositories\SubscriptionRepository;

use App\Http\Controllers\Controller;

use App\Repositories\PlanRepository;

use Illuminate\Http\Request;

use Laravel\Cashier\Payment;

use Illuminate\Support\Arr;

use Laravel\Cashier\Cashier;

use App\Repositories\UserRepository;

use Laravel\Cashier\Exceptions\IncompletePayment;

use Laravel\Cashier\Exceptions\InvalidPaymentMethod;

class ManageSubscriptionController extends Controller
{
    public $successStatus = 200;

    protected $subscriptionRepository;

    protected $planRepository;

    /**
     * __construct
     *
     * @param  mixed $subscriptionRepository
     * @param  mixed $planRepository
     * @return void
     */
    public function __construct(SubscriptionRepository $subscriptionRepository, PlanRepository $planRepository)
    {
        $this->subscriptionRepository = $subscriptionRepository;
        $this->planRepository = $planRepository;
    }

    /**
     * createSetupIntent
     * @param  mixed $request
     * @return void
     */
    public function createSetupIntent(Request $request)
    {
        if (!$request->user()->stripe_id) {
            $request->user()->createAsStripeCustomer();
        }

        $intent = $request->user()->createSetupIntent();

        return response()->json([
            'success' => true,
            "data" => array(
                'intent' => $intent
            )
        ], $this->successStatus);
    }

    /**
     * create
     * @param  mixed $request
     * @return void
     */
    public function create(Request $request)
    {
        try {
            $plan_id = $request->plan_id;

            $plan = $this->planRepository->getPlan($plan_id);

            $active_subscription = UserRepository::getActiveSubscription($request->user());

            if ($plan && $plan->stripe_subscription_id && $plan->stripe_price_id) {

                $current_plan = $active_subscription ? $this->planRepository->getPlanByPrice($active_subscription->stripe_price) : null;

                if (!$active_subscription || ($current_plan && $current_plan->ltd === 1)) {

                    //Unsubscribed lifetime subscription if have
                    if($current_plan && $current_plan->ltd === 1) {

                        $request->merge(['user_id' => $request->user()->id]);

                        $this->subscriptionRepository->deleteLtd($request->all(), false);

                    }

                    $total_subscriptions = $request->user()->subscriptions()->whereNull('subscriptions.deleted_at')->count();

                    if ($total_subscriptions == 0) {
                        $subscription = $request->user()->newSubscription(
                            $plan->stripe_subscription_id,
                            $plan->stripe_price_id
                        )
                        ->trialDays(PlanRepository::getTrialsDays())
                        ->create($request->paymentMethodId);
                    } else {
                        $subscription = $request->user()->newSubscription(
                            $plan->stripe_subscription_id,
                            $plan->stripe_price_id
                        )
                        ->create($request->paymentMethodId);
                    }

                    //Convert user to pro
                    $request->user()->is_free = 0;
                    $request->user()->save();

                    return response()->json([
                        'success' => true,
                        "data" => array(
                            'subscription' => $subscription,
                        )
                    ], $this->successStatus);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => "User is already subscribed to some other plan so you can just upgrade to some other plan."
                    ], $this->successStatus);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "please choose some plan to proceed."
                ], $this->successStatus);
            }
        } catch (IncompletePayment $exception) {
            return response()->json([
                'success' => false,
                'status_code' => $exception->payment->status,
                'message' => $exception->getMessage()
            ], $this->successStatus);
        }
    }

    /**
     * update
     * @param  mixed $request
     * @return void
     */
    public function update(Request $request)
    {
        try {
            $plan_id = $request->plan_id;

            $plan = $this->planRepository->getPlan($plan_id);

            $subscription = UserRepository::getActiveSubscription($request->user());

            if ($plan && $plan->stripe_price_id && $plan->stripe_price_id) {
                if ($subscription && $subscription->name) {
                    //User current plan total websites
                    $total_websites = UserRepository::userTotalWebsites($request->user(), true);

                    if ($plan->websites == 0 || $plan->websites >= $total_websites) {
                        $previous_plan = $this->planRepository->getPlanByPrice($subscription->stripe_price);

                        if ($previous_plan) {

                            $this->subscriptionRepository->deletePrevSubscription([
                                'user_id' => $request->user()->id
                            ]);

                            if($request->paymentMethodId) {
                                $request->user()->updateDefaultPaymentMethod($request->paymentMethodId);
                            }

                            if ($plan->price < $previous_plan->price || $request->swapOnly) {

                                $response = $request->user()->subscription($subscription->name)->noProrate()->swap($plan->stripe_price_id);

                                //Downgrade to previous plan incase has same interval and new plan has low price then previous
                                if ($plan->months == $previous_plan->months && !$request->swapOnly) {
                                    $this->subscriptionRepository->updateSubscription([
                                        'user_id' => $request->user()->id,
                                        'plan_from' => $previous_plan->id,
                                        'plan_to' => $plan->id,
                                    ]);
                                }

                            } else {

                                $response = $request->user()->subscription($subscription->name)->swapAndInvoice($plan->stripe_price_id);

                            }

                            return response()->json([
                                'success' => true,
                                'message' => "Subscription updated successfully",
                                'response' => $response
                            ], $this->successStatus);
                        } else {
                            return response()->json([
                                'success' => false,
                                'message' => "Your existing plan does not exist."
                            ], $this->successStatus);
                        }
                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => "This plan allows maximum of $plan->websites pro websites and your account currently have $total_websites pro website. Please convert some pro websites into free to proceed."
                        ], $this->successStatus);
                    }
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => "User has no active subscription."
                    ], $this->successStatus);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "please choose some plan to proceed."
                ], $this->successStatus);
            }
        } catch (IncompletePayment $exception) {
            return response()->json([
                'success' => false,
                'status_code' => $exception->payment->status,
                'message' => $exception->getMessage()
            ], $this->successStatus);
        }
    }

    /**
     * previewInvoice
     * @param  mixed $request
     * @return void
     */
    public function previewInvoice(Request $request)
    {
        try {
            $plan_id = $request->plan_id;

            $plan = $this->planRepository->getPlan($plan_id);

            if ($plan && $plan->stripe_price_id && $plan->stripe_price_id) {

                $subscription = UserRepository::getActiveSubscription($request->user());

                if ($subscription && $subscription->name) {

                    $previous_plan = $this->planRepository->getPlanByPrice($subscription->stripe_price);

                    if ($previous_plan) {

                        if ($plan->price < $previous_plan->price) {
                            $invoice = $request->user()->subscription($subscription->name)->noProrate()->previewInvoice($plan->stripe_price_id);
                        } else {
                            $invoice = $request->user()->subscription($subscription->name)->previewInvoice($plan->stripe_price_id);
                        }

                        if ($previous_plan->price < $plan->price && $plan->months == $previous_plan->months) {
                            $next_bill_at = \Carbon\Carbon::now()->toFormattedDateString();
                            $amount = number_format(($invoice->total / 100) - $plan->price, 2);
                        } else {
                            $next_bill_at = \Carbon\Carbon::parse($invoice->next_payment_attempt)->toFormattedDateString();
                            $amount = number_format(($invoice->total / 100), 2);
                        }

                        return response()->json([
                            'success' => true,
                            'data' => array(
                                'invoice' => array(
                                    'amount' => $amount,
                                    'current_date' => \Carbon\Carbon::now()->toFormattedDateString(),
                                    'next_bill_at' => $next_bill_at,
                                    'period_start' => \Carbon\Carbon::parse($invoice->period_start)->toFormattedDateString(),
                                    'period_end' => \Carbon\Carbon::parse($invoice->period_end)->toFormattedDateString(),
                                    'subscription_proration_date' => isset($invoice->subscription_proration_date) ? \Carbon\Carbon::parse($invoice->subscription_proration_date)->toFormattedDateString() : '',
                                    'plan' => $plan
                                )
                            )
                        ], $this->successStatus);

                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => "Your existing plan does not exist."
                        ], $this->successStatus);
                    }
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => "User has no active subscription."
                    ], $this->successStatus);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "please choose some plan to proceed."
                ], $this->successStatus);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $this->successStatus);
        }
    }

    /**
     * latestInvoice
     * @param  mixed $request
     * @return void
     */
    public function latestInvoice(Request $request)
    {
        $subscription = UserRepository::getActiveSubscription(request()->user());

        $latest_invoice = $subscription->latestPayment();

        $amount = $latest_invoice ? number_format(($latest_invoice->amount / 100), 2) : 0.00;

        return response()->json([
            'success' => true,
            'data' => array(
                "invoice" => array(
                    'amount' => $amount,
                    'current_date' => 1,
                    'next_bill_at' => 1
                )
            )
        ], $this->successStatus);
    }

    /**
     * paymentConfirm
     * @param  mixed $request
     * @return void
     */
    public function paymentConfirm(Request $request, $paymentIntent)
    {
        try {
            $payment = new Payment(
                Cashier::stripe()->paymentIntents->retrieve(
                    $paymentIntent,
                    ['expand' => ['payment_method']]
                )
            );

            $paymentIntent = Arr::only($payment->asStripePaymentIntent()->toArray(), [
                'id', 'status', 'payment_method_types', 'client_secret', 'payment_method',
            ]);

            $paymentIntent['payment_method'] = Arr::only($paymentIntent['payment_method'] ?? [], 'id');

            return response()->json([
                'success' => true,
                'data' => [
                    'stripeKey' => config('cashier.key'),
                    'amount' => $payment->amount(),
                    'payment' => $payment,
                    'paymentIntent' => array_filter($paymentIntent),
                    'paymentMethod' => (string) request('source_type', optional($payment->payment_method)->type),
                    'errorMessage' => request('redirect_status') === 'failed'
                        ? 'Something went wrong when trying to confirm the payment. Please try again.'
                        : '',
                    'customer' => $payment->customer(),
                    'redirect' => url(request('redirect', '/')),
                ]
            ], $this->successStatus);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $this->successStatus);
        }
    }

    /**
     * paymentConfirm
     * @param  mixed $request
     * @return void
     */
    public function paymentConfirmByCard(Request $request, $paymentIntent)
    {
        try {
            $response = Cashier::stripe()->paymentIntents->confirm(
                $paymentIntent,
                ['payment_method' => $request->payment_method]
            );

            if ($response['status'] == "requires_action") {
                return response()->json([
                    'success' => false,
                    'status_code' => $response['status'],
                    'message' => "Additional payment action required."
                ], $this->successStatus);
            } elseif ($response['status'] == "requires_payment_method") {
                return response()->json([
                    'success' => false,
                    'status_code' => $response['status'],
                    'message' => "The payment attempt failed because of an invalid payment method."
                ], $this->successStatus);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $response
                ], $this->successStatus);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $this->successStatus);
        }
    }

    /**
         * cancel
         * @param  mixed $request
         * @return void
         */
    public function cancel(Request $request)
    {
        try {
            $subscription = UserRepository::getActiveSubscription($request->user());

            if ($subscription) {

                $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);

                //Life time subscription
                if($plan->ltd == 1) {

                    $request->merge(['user_id' => $request->user()->id]);

                    $this->subscriptionRepository->deleteLtd($request->all());

                    return response()->json([
                        'success' => true,
                        'message' => "Subscription canceled successfully.",
                    ], $this->successStatus);

                } else {
                    if (!$subscription->hasIncompletePayment()) {
                        if ($request->user()->subscribed($request->name)) {
                            if ($subscription->stripe_status == 'trialing') {
                                $request->user()->subscription($request->name)->cancelNow();
                            } else {
                                $request->user()->subscription($request->name)->cancel();
                            }

                            return response()->json([
                                'success' => true,
                                'message' => "Subscription canceled successfully.",
                            ], $this->successStatus);
                        } else {
                            return response()->json([
                                'success' => false,
                                'message' => "You are not subscribed to any plan"
                            ], $this->successStatus);
                        }
                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => "You have some incomplete payments, please confirm your payments."
                        ], $this->successStatus);
                    }
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "You are not subscribed to any plan"
                ], $this->successStatus);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $this->successStatus);
        }
    }

    /**
     * resume
     * @param  mixed $request
     * @return void
     */
    public function resume(Request $request)
    {
        try {
            if ($request->user()->subscription($request->name)->onGracePeriod()) {
                $request->user()->subscription($request->name)->resume();
                return response()->json([
                    'success' => true,
                    'message' => "Subscription resume successfully.",
                ], $this->successStatus);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "User is not subscribed to this subscription.",
                ], $this->successStatus);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $this->successStatus);
        }
    }

    /**
     * getAllSubscriptions
     * @param  mixed $request
     * @return void
     */
    public function getAllSubscriptions(Request $request)
    {
        $subscriptions = UserRepository::getActiveSubscriptions($request->user());

        return response()->json([
            'success' => true,
            'data' => array(
                "subscriptions" => $subscriptions
            ),
        ], $this->successStatus);
    }

    /**
     * getPaymentMethods
     * @param  mixed $request
     * @return void
     */
    public function getPaymentMethods(Request $request)
    {
        try {

            if($request->user()->stripe_id) {

                $default_payment_method = $request->user()->defaultPaymentMethod();

                $payment_methods = $request->user()->paymentMethods();

                return response()->json([
                    'success' => true,
                    "data" => array(
                        'payment_methods' => $payment_methods,
                        'default_payment_method' => $default_payment_method
                    )
                ], $this->successStatus);

            } else {

                return response()->json([
                    'success' => true,
                    "data" => array(
                        'payment_methods' => [],
                        'default_payment_method' => []
                    )
                ], $this->successStatus);

            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $this->successStatus);
        }
    }

    /**
     * createPaymentMethod
     * @param  mixed $request
     * @return void
     */
    public function createPaymentMethod(Request $request)
    {
        if (!$request->user()->stripe_id) {
            $request->user()->createAsStripeCustomer();
        }

        $request->user()->addPaymentMethod($request->paymentMethodId);

        $request->user()->updateDefaultPaymentMethod($request->paymentMethodId);

        return response()->json([
            'success' => true,
        ], $this->successStatus);
    }

    /**
     * deletePaymentMethod
     * @param  mixed $request
     * @return void
     */
    public function deletePaymentMethod(Request $request)
    {
        $paymentMethod = $request->user()->findPaymentMethod($request->paymentMethodId);

        $defaultPaymentMethod = $request->user()->defaultPaymentMethod();

        $paymentMethods = $request->user()->paymentMethods();

        if (count($paymentMethods) > 1) {
            if (!$defaultPaymentMethod || ($paymentMethod && $paymentMethod->id != $defaultPaymentMethod->id)) {
                //Delete
                $paymentMethod->delete();

                return response()->json([
                    'success' => true,
                ], $this->successStatus);
            } else {
                return response()->json([
                    'success' => false,
                    "message" => "Default payment method cannot be delete it."
                ], $this->successStatus);
            }
        } else {
            return response()->json([
                'success' => false,
                "message" => "This payment method cannot be delete it, because you must have atleast one payment method."
            ], $this->successStatus);
        }
    }

    /**
     * makeDefaultPaymentMethod
     * @param  mixed $request
     * @return void
     */
    public function makeDefaultPaymentMethod(Request $request)
    {
        $paymentMethod = $request->user()->findPaymentMethod($request->paymentMethodId);

        if ($paymentMethod) {
            $request->user()->updateDefaultPaymentMethod($request->paymentMethodId);
        }

        return response()->json([
            'success' => true,
        ], $this->successStatus);
    }

    /**
     * getBillingHistory
     * @param  mixed $request
     * @return void
     */
    public function getBillingHistory(Request $request)
    {
        $request->merge(['page' => (int)$request->page, 'user_id' => $request->user()->id]);

        $billing_history = $this->subscriptionRepository->getBillingHistory($request->all());

        return response()->json([
            'success' => true,
            "data" => array(
                'billing_history' => $billing_history
            )
        ], $this->successStatus);
    }

    /**
     * reachargeBalance
     * @param  mixed $request
     * @return void
     */
    public function reachargeBalance(Request $request)
    {
        if ($request->user()->hasDefaultPaymentMethod() || $request->payment_method) {
            try {
                $subscription = UserRepository::getActiveSubscription($request->user());

                if ($subscription) {

                    $request->user()->updateDefaultPaymentMethod($request->payment_method);

                    $response = $request->user()->invoiceFor(
                        'CDN Recharge',
                        (round(($request->balance * 100), 2)), [],
                        [
                            'statement_descriptor' => config('services.stripe.payment_prefix')
                        ]
                    );

                    if ($response->status == 'paid') {
                        $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);

                        $this->subscriptionRepository->addBalance([
                            'amount' => round($request->balance, 2),
                            'status' => 'processing',
                            'user_id' => $request->user()->id,
                            'transaction_id' => $response->payment_intent,
                            'invoice_id' => $response->id,
                            'plan_id' => $plan->id
                        ]);

                        return response()->json([
                            'success' => true,
                            "message" => "You have recharged your balance successfully."
                        ], $this->successStatus);
                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => "Payment failed please try again."
                        ], $this->successStatus);
                    }
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => "You are not subscribed to any plan"
                    ], $this->successStatus);
                }
            } catch (IncompletePayment $exception) {

                $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);

                $this->subscriptionRepository->addBalance([
                    'amount' => round($request->balance, 2),
                    'status' => 'processing',
                    'user_id' => $request->user()->id,
                    'transaction_id' => $exception->payment->id,
                    'invoice_id' => $exception->payment->invoice->id,
                    'plan_id' => $plan->id
                ]);

                if ($exception->payment->status == "requires_action") {
                    //Save last cdn payment intent for later usage
                    $request->user()->last_cdn_payment_intent = $exception->payment->id;
                    $request->user()->save();
                }

                return response()->json([
                    'success' => false,
                    'status_code' => $exception->payment->status,
                    'message' => $exception->getMessage()
                ], $this->successStatus);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => "You have not added any payment card, please add your payment card first and then retry again."
            ], $this->successStatus);
        }
    }

    /**
     * downloadInvoice
     *
     * @param  mixed $request
     * @param  mixed $user_id
     * @param  mixed $invoice_id
     * @return void
     */
    public function downloadInvoice(Request $request, $user_id, $invoice_id, $plan_id = null)
    {
        $user = \App\Models\User::where('id', $user_id)->first();

        if (!$plan_id) {
            $plan_id = $this->subscriptionRepository->getPlanIdByInvoiceId($invoice_id);
        }

        $plan = $this->planRepository->getPlan($plan_id);

        return $user->downloadInvoice($invoice_id, [
            'vendor' => config('app.name'),
            'product' => $plan->name,
        ]);
    }

    /**
     * redeemLtdCode
     * @param  mixed $request
     * @return void
     */
    public function redeemLtdCode(Request $request)
    {
        $request->merge(['user_id' => $request->user()->id]);

        $response = $this->subscriptionRepository->redeemLtdCode($request->all());

        return response()->json($response, $this->successStatus);
    }

    /**
     * cancelLtdDeal
     * @param  mixed $request
     * @return void
     */
    public function cancelLtdDeal(Request $request)
    {

    }
}
