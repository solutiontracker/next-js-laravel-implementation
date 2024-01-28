<?php

namespace App\Repositories;

use Illuminate\Http\Request;

class SubscriptionRepository extends AbstractRepository
{

    /**
     * cdnRepository
     *
     * @var mixed
     */
    private $cdnRepository;

    /**
     * __construct
     *
     * @param  mixed $cdnRepository
     * @return void
     */
    public function __construct(CdnRepository $cdnRepository)
    {
        $this->cdnRepository = $cdnRepository;
    }

    /**
     * getBillingHistory
     *
     * @param  mixed $formInput
     * @return void
     */
    public function getBillingHistory($formInput)
    {
        $query = \App\Models\BillingHistory::with(['user', 'plan'])->where('user_id', $formInput['user_id']);
        $billing_history = $query->orderBy('created_at', 'DESC')->paginate($formInput['limit'])->toArray();
        return $billing_history;
    }

    /**
     * addBalance
     *
     * @param  mixed $formInput
     * @return void
     */
    public function addBalance($formInput) {
        return \App\Models\BillingHistory::create([
            'invoice_id' => $formInput['invoice_id'],
            'transaction_id' => $formInput['transaction_id'],
            'user_id' => $formInput['user_id'],
            'plan_id' => $formInput['plan_id'],
            'status' => $formInput['status'],
            'amount_paid' => $formInput['amount'],
            'type' => 'cdn',
            'cdn_auto_recharge' => isset($formInput['cdn_auto_recharge']) ? $formInput['cdn_auto_recharge'] : 0
        ]);
    }

    /**
     * updateSubscription
     *
     * @param  mixed $formInput
     * @return void
     */
    public function updateSubscription($formInput) {
        $subscription =  \App\Models\SubscriptionUpdate::where('user_id', $formInput['user_id'])->first();
        if($subscription) {
            $subscription->plan_from = $formInput['plan_from'];
            $subscription->plan_to = $formInput['plan_to'];
            $subscription->date = \Carbon\Carbon::now()->toDateString();
            $subscription->save();
        } else {
            return \App\Models\SubscriptionUpdate::create([
                'plan_from' => $formInput['plan_from'],
                'plan_to' => $formInput['plan_to'],
                'date' => \Carbon\Carbon::now()->toDateString(),
                'user_id' => $formInput['user_id'],
            ]);
        }
    }

    /**
     * deletePrevSubscription
     *
     * @param  mixed $formInput
     * @return void
     */
    public function deletePrevSubscription($formInput) {
        \App\Models\SubscriptionUpdate::where('user_id', $formInput['user_id'])->delete();
    }

    /**
     * getPlanIdByInvoiceId
     *
     * @param  mixed $invoice_id
     * @return void
     */
    public function getPlanIdByInvoiceId($invoice_id) {
        return \App\Models\BillingHistory::where('invoice_id', $invoice_id)->value('plan_id');
    }

    /**
     * redeemLtdCode
     *
     * @param  mixed $formInput
     * @return void
     */
    public function redeemLtdCode($formInput) {
        $user = UserRepository::getUser(['id' => $formInput['user_id']]);
        $coupon = \App\Models\Coupon::join('plans_coupon', 'plans_coupon.coupon_id', '=', 'coupons.id')
            ->join('plans', 'plans_coupon.plan_id', '=', 'plans.id')
            ->where('plans.ltd', 1)
            ->where('coupons.code', $formInput['code'])
            ->where('coupons.once_use', 0)
            ->select('coupons.*', 'plans.id as plan_id')
            ->first();
        if($coupon) {
            $plan = PlanRepository::getPlanByID($coupon->plan_id);
            if($plan) {
                //Delete subscription if have
                $result = $this->deleteImmediatelySubscription($user);
                if($result['success']) {
                    \App\Models\Subscription::create([
                        'user_id' => $user->id,
                        'name' => $plan->stripe_subscription_id,
                        'stripe_price' => $plan->stripe_price_id,
                        'stripe_id' => "system_ltd_coupon_".$coupon->id.'-'.time(),
                        'stripe_status' => "active",
                        'quantity' => "1",
                    ]);

                    //Convert to pro
                    $user->is_free = 0;
                    $user->save();

                    //Once used
                    $coupon = \App\Models\Coupon::where('id', $coupon->id)->first();
                    $coupon->once_use = 1;
                    $coupon->save();
                    return [
                        "success" => true,
                    ];
                } else {
                    return $result;
                }
            }
        } else {
            return [
                "success" => false,
                "message" => "Invalid coupon code!",
            ];
        }
    }

    /**
     * deleteLtd
     *
     * @param  mixed $formInput
     * @param  mixed $convert_to_free
     * @return void
    */
    public function deleteLtd($formInput, $convert_to_free = true) {
        $user = UserRepository::getUser(['id' => $formInput['user_id']]);
        if($user) {
            \App\Models\CouponHistory::where('user_id', $user->id)->delete();
            \App\Models\Subscription::where('user_id', $user->id)->delete();

            if($convert_to_free) {
                //Switch user to free plan & deactivate cdn
                $user->is_free = 1;
                $user->cdn_active = 0;
                $user->save();

                //Convert all websites to free and disabled CDN
                $this->cdnRepository->convertAllWebsiteToFree($user);
            }
        }

    }

    /**
     * deleteImmediatelySubscription
     *
     * @param  mixed $user
     * @return void
    */
    public function deleteImmediatelySubscription($user) {
        try {
            $subscription = UserRepository::getActiveSubscription($user);
            if ($subscription) {
                $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);
                //Life time subscription
                if($plan->ltd == 1) {
                    $this->subscriptionRepository->deleteLtd(['user_id' => $user->id]);
                } else {
                    if (!$subscription->hasIncompletePayment()) {
                        if ($user->subscribed($subscription->name)) {
                            $user->subscription($subscription->name)->cancelNow();
                        }
                    } else {
                        return [
                            'success' => false,
                            'message' => "You have some incomplete payments, please confirm your payments."
                        ];
                    }
                }
            }
            return [
                'success' => true,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
