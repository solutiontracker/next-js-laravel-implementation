<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use App\Notifications\Auth\User\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Cashier\Billable;
use Illuminate\Support\Facades\Storage;
use App\Repositories\UserRepository;
use App\Repositories\PlanRepository;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens;

    use HasFactory;

    use Notifiable;

    use SoftDeletes;

    use Billable;

    protected $table = 'users';

    protected $fillable = ['name', 'first_name', 'last_name', 'email', 'password', 'phone', 'status', 'refferd_by', 'origin', 'country_id', 'refferal_id', 'registration_ip', 'last_login_ip', 'last_login', 'is_affiliated', 'email_verified_at', 'api_token', 'profession', 'google_id', 'facebook_id', 'wordpress_id', 'continent', 'state', 'city', 'use_agent', 'updated_email', 'stripe_id', 'pm_type', 'pm_last_four', 'trial_ends_at', 'image', 'auto_recharge', 'cdn_active', 'is_free', 'last_cdn_payment_intent', 'cdn_low_balance_alert_at', 'cdn_low_balance_alert_count', 'cdn_auto_recharge_failed_count',  'frill_token'];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $appends = ['hasPassword'];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'use_agent' => 'array'
    ];

    protected $dates = ['deleted_at'];

    /**
     * Get the user's image.
     *
     * @param  string  $value
     * @return string
     */
    public function getImageAttribute($value)
    {
        if ($value) {
            return $value ? Storage::disk('ftp')->url('images/profile/'.$value) : null;
        } else {
            return \Gravatar::get($this->attributes['email']);
        }
    }

    /**
     * Get the user's subscription.
     *
     * @param  string  $value
     * @return string
     */
    public function getSubscriptionAttribute($value)
    {
        if (request()->user()) {
            $subscription = UserRepository::getActiveSubscription(request()->user());

            //User current plan total websites
            $total_websites = UserRepository::userTotalWebsites(request()->user(), true);

            //User total subscriptions
            $total_subscriptions = request()->user()->subscriptions()->whereNull('subscriptions.deleted_at')->count();

            //Trial days
            $trial_days = PlanRepository::getTrialsDays();

            if ($subscription && request()->user()->is_free == 0) {

                //User current plan total free websites
                $free_websites = UserRepository::userTotalFreeWebsites(request()->user());

                $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);

                if($plan->ltd == 0) {

                    $current_period_start = \Carbon\Carbon::parse($subscription->asStripeSubscription()->current_period_start)->toDateString();

                    $current_period_end = \Carbon\Carbon::parse($subscription->asStripeSubscription()->current_period_end)->toDateString();

                    $previous_subscription = \App\Models\SubscriptionUpdate::whereDate('date', '>=', $current_period_start)->whereDate('date', '<=', $current_period_end)->where('user_id', request()->user()->id)->with(['plan_from', 'plan_to'])->first();

                    $last_payment_intent = null;

                    if (request()->user()->subscription($subscription->name) && request()->user()->subscription($subscription->name)->hasIncompletePayment()) {
                        $last_payment = $subscription->latestPayment();
                        $last_payment_intent = in_array($last_payment->status, ['requires_action', 'requires_confirmation', 'requires_payment_method']) ? $subscription->latestPayment() : null;
                    }

                    $remaining_websites_tooltip = ($plan->websites == 0 ? "You have used $total_websites out of ∞ (unlimited) Pro websites quota." : "You have used $total_websites out of $plan->websites Pro websites quota.");

                    $free_websites_tooltip = "You have used $free_websites out of ∞ (unlimited) Free websites quota.";

                    return [
                        'trial_days' => $trial_days,
                        'trial_days_end' => \Carbon\Carbon::parse($subscription->trial_ends_at)->toFormattedDateString(),
                        'total_subscriptions' => $total_subscriptions,
                        'plan' => $plan,
                        'current_period_end' => \Carbon\Carbon::parse($subscription->asStripeSubscription()->current_period_end)->toFormattedDateString(),
                        'current_period_start' => \Carbon\Carbon::parse($subscription->asStripeSubscription()->current_period_start)->toFormattedDateString(),
                        'subscription' => $subscription,
                        'previous_subscription' => $previous_subscription,
                        'last_payment_intent' => $last_payment_intent,
                        'total_websites' => $total_websites,
                        'limit_websites' => $plan->websites,
                        'free_websites' => $free_websites,
                        'free_websites_tooltip' => $free_websites_tooltip,
                        'remaining_websites' => ($plan->websites == 0 ? $total_websites.' / ∞' : $total_websites.' / '.$plan->websites),
                        'remaining_websites_tooltip' => $remaining_websites_tooltip
                    ];
                } else {

                    $remaining_websites_tooltip = ($plan->websites == 0 ? "You have used $total_websites out of ∞ (unlimited) Pro websites quota." : "You have used $total_websites out of $plan->websites Pro websites quota.");

                    $free_websites_tooltip = "You have used $free_websites out of ∞ (unlimited) Free websites quota.";

                    return [
                        'total_subscriptions' => $total_subscriptions,
                        'plan' => $plan,
                        'subscription' => $subscription,
                        'total_websites' => $total_websites,
                        'limit_websites' => $plan->websites,
                        'free_websites' => $free_websites,
                        'free_websites_tooltip' => $free_websites_tooltip,
                        'remaining_websites' => ($plan->websites == 0 ? $total_websites.' / ∞' : $total_websites.' / '.$plan->websites),
                        'remaining_websites_tooltip' => $remaining_websites_tooltip
                    ];
                }

            } else {
                $remaining_websites_tooltip = "You have used $total_websites out of ∞ (unlimited) Free websites quota.";

                return [
                    'trial_days' => $trial_days,
                    'trial_days_end' => \Carbon\Carbon::now()->addDays($trial_days)->toFormattedDateString(),
                    'total_subscriptions' => $total_subscriptions,
                    'remaining_websites' => $total_websites.' / ∞',
                    'remaining_websites_tooltip' => $remaining_websites_tooltip
                ];
            }
        } else {
            return null;
        }
    }

    /**
     * Get the user's balance.
     *
     * @param  string  $value
     * @return string
     */
    public function getBalanceAttribute($value)
    {
        if (request()->user()) {
            $usage_amount = \App\Models\CdnUserStat::where('user_id', request()->user()->id)->select(\DB::raw('SUM(chargeable_volume_amount) as chargeable_volume_amount'), \DB::raw('SUM(chargeable_premium_amount) as chargeable_premium_amount'))->first();
            $paid_amount = \App\Models\BillingHistory::where('user_id', request()->user()->id)->where('type', 'cdn')->where('status', 'succeeded')->sum('amount_paid');
            return round($paid_amount - ($usage_amount->chargeable_volume_amount + $usage_amount->chargeable_premium_amount), 2);
        } else {
            return 0;
        }
    }

    /**
     * Get the user's balance with format.
     *
     * @param  string  $value
     * @return string
     */
    public function getBalanceDisplayAttribute($value)
    {
        if (request()->user()) {
            $usage_amount = \App\Models\CdnUserStat::where('user_id', request()->user()->id)->select(\DB::raw('SUM(chargeable_volume_amount) as chargeable_volume_amount'), \DB::raw('SUM(chargeable_premium_amount) as chargeable_premium_amount'))->first();
            $paid_amount = \App\Models\BillingHistory::where('user_id', request()->user()->id)->where('type', 'cdn')->where('status', 'succeeded')->sum('amount_paid');
            return number_format((abs($paid_amount - ($usage_amount->chargeable_volume_amount + $usage_amount->chargeable_premium_amount))), 2);
        } else {
            return 0;
        }
    }

    //Send password reset notification
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * websites
     *
     * @return void
     */
    public function websites()
    {
        return $this->hasMany(Website::class, 'user_id');
    }

    /**
     * Get last cdn incomplete payment id.
     *
     * @param  string  $value
     * @return string
     */
    public function getLastCdnPaymentIntentAttribute($value)
    {
        try {
            if($value) {
                $stripe = new \Stripe\StripeClient(
                    config("services.stripe.secret")
                );

                $payment = $stripe->paymentIntents->retrieve(
                    $value,
                    []
                );

                if(in_array($payment->status, ['requires_action', 'requires_confirmation', 'requires_payment_method'])) {
                    return $payment;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (IncompletePayment $exception) {
            \Log::error($exception->getMessage());
            return null;
        }
    }

    /**
     * Check if user password required.
     *
     * @param  string  $value
     * @return string
     */
    public function getHasPasswordAttribute()
    {
        return !is_null($this->password);
    }
}
