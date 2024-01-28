<?php

namespace App\Repositories;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Notification;

use App\Notifications\Auth\User\EmailChangeRequestSecurity;

use App\Notifications\Auth\User\EmailChangeVerification;

use App\Notifications\Auth\User\EmailUpdated;

use App\Notifications\system\NewsletterEmailVerification;

class UserRepository extends AbstractRepository
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public static function getUser($formInput)
    {
        return \App\Models\User::where('id', $formInput['id'])->first();
    }

    /**
     * @param mixed $formInput
     * @param $website_id
     * @return object
     */
    public function getUserByWebsite($website_id)
    {
        return \App\Models\User::join('websites', 'websites.user_id', '=', 'users.id')->where('websites.id', $website_id)->select('users.*')->first();
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public function updateUser($formInput)
    {
        $user = \App\Models\User::where('id', $formInput['id'])->first();

        if ($user) {
            $orignal_email = $user->email;

            $user->first_name = $formInput['first_name'];

            $user->last_name = $formInput['last_name'];

            $user->name = $formInput['first_name'].' '.$formInput['last_name'];

            if (isset($formInput['password']) && $formInput['password']) {
                $user->password = bcrypt($formInput['password']);
            }

            if ($user->email != $formInput['email']) {
                //Token [Verification]
                $token = rand(100000, 999999);

                \App\Models\UserVerify::create([
                    'token' => $token,
                    'user_id' => $user->id,
                    'expire_at' => \Carbon\Carbon::now()->addHours(config('auth.passwords.users.expire') / 60)
                ]);

                $user->updated_email = $formInput['email'];

                //Notification [change email request]
                Notification::sendNow($user, new EmailChangeRequestSecurity());

                //Update just to send verification email on new email address using modal notifications
                $user->email = $formInput['email'];

                //Verification email
                Notification::sendNow($user, new EmailChangeVerification($token));

                $user->updated_email = $formInput['email'];

                //Revert back to orignal after sending
                $user->email = $orignal_email;
            }

            //Avatar
            if (isset($formInput['image']) && $formInput['image']) {
                //Unlink
                if (Storage::disk('ftp')->exists('images/profile/' . $user->image)) {
                    Storage::disk('ftp')->delete('images/profile/' . $user->image);
                }

                $image      = $formInput['image'];
                $image_name = time() . '.' . $image->extension();
                $image = \Image::make($formInput['image'])
                    ->resize(120, 120, function ($constraint) {
                        $constraint->aspectRatio();
                    });

                $resource = $image->stream()->detach();

                Storage::disk('ftp')->put('images/profile/' . $image_name, $resource);

                //Save to db
                $user->image = $image_name;
            }

            $user->frill_token = getFrillToken($user);

            $user->save();
        }

        return $user;
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public function discardEmail($formInput)
    {
        $user = \App\Models\User::where('id', $formInput['id'])->first();
        if ($user) {
            $user->updated_email = null;
            $user->save();
        }
        return $user;
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public function resendVerificationEmail($formInput)
    {
        $user = \App\Models\User::where('id', $formInput['id'])->first();

        if ($user) {
            //Token [Verification]
            $token = rand(100000, 999999);

            \App\Models\UserVerify::create([
                'token' => $token,
                'user_id' => $user->id,
                'expire_at' => \Carbon\Carbon::now()->addHours(config('auth.passwords.users.expire') / 60)
            ]);

            //Notification [change email request]
            Notification::sendNow($user, new EmailChangeRequestSecurity());

            //Update just to send verification email on new email address using modal notifications
            $user->email = $user->updated_email;

            //Verification email
            Notification::sendNow($user, new EmailChangeVerification($token));
        }
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public function updateEmail($formInput)
    {
        $token = \App\Models\UserVerify::where('token', $formInput['token'])->where('user_id', $formInput['id'])->where('expire_at', '>', date('Y-m-d H:i:s'))->first();

        if ($token) {
            $user = \App\Models\User::where('id', $formInput['id'])->first();

            if ($user) {

                //Notification [Email updated]
                Notification::sendNow($user, new EmailUpdated());

                $user->email = $user->updated_email;
                $user->updated_email = null;
                $user->save();
            }

            //Delete token
            $token->delete();

            return $user;
        } else {
            return false;
        }
    }

    /**
     * removeAvatar
     *
     * @param  mixed $formInput
     * @return void
     */
    public function removeAvatar($formInput)
    {
        $user = \App\Models\User::where('id', $formInput['id'])->first();

        if ($user) {
            //Unlink
            if (Storage::disk('ftp')->exists('images/profile/' . $user->image)) {
                Storage::disk('ftp')->delete('images/profile/' . $user->image);
            }

            $user->image = null;
            $user->save();
        }

        return $user;
    }

    /**
     * connectAccount
     *
     * @param  mixed $formInput
     * @return void
     */
    public function connectAccount($formInput)
    {
        $user = \App\Models\User::where('id', $formInput['id'])->first();
        if ($user) {
            if ($formInput['provider'] == 'google') {
                $user->google_id = $formInput['provider_id'];
            } elseif ($formInput['provider'] == 'facebook') {
                $user->facebook_id = $formInput['provider_id'];
            } elseif ($formInput['provider'] == 'wordpress') {
                $user->wordpress_id = $formInput['provider_id'];
            }
            $user->save();
        }
        return $user;
    }

    /**
     * disconnectAccount
     *
     * @param  mixed $formInput
     * @return void
     */
    public function disconnectAccount($formInput)
    {
        $user = \App\Models\User::where('id', $formInput['id'])->first();
        if ($user) {
            if ($formInput['provider'] == 'google') {
                $user->google_id = null;
            } elseif ($formInput['provider'] == 'facebook') {
                $user->facebook_id = null;
            } elseif ($formInput['provider'] == 'wordpress') {
                $user->wordpress_id = null;
            }
            $user->save();
        }
        return $user;
    }

    /**
     * updateAutoRecharge
     *
     * @param  mixed $formInput
     * @return void
     */
    public function updateAutoRecharge($formInput)
    {
        $user = \App\Models\User::where('id', $formInput['id'])->first();
        if ($user) {
            $user->auto_recharge = $formInput['balance'];
            $user->save();
        }
        return $user;
    }

    /**
     * returnUserJson
     *
     * @param  mixed $user
     * @return void
     */
    public function returnUserJson($user)
    {
        return [
            'id' => $user->id,
            'email' => $user->email,
            'auto_recharge' => $user->auto_recharge,
            'google_id' => $user->google_id,
            'facebook_id' => $user->facebook_id,
            'wordpress_id' => $user->wordpress_id,
            'frill_token' => $user->frill_token,
            'image' => $user->image,
            'updated_email' => $user->updated_email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email_verified_at' => $user->email_verified_at,
            'name' => $user->first_name . ' ' . $user->last_name,
            'subscription' => $user->subscription,
            'balance' => $user->balance,
            'balance_display' => $user->balance_display,
            'cdn_active' => $user->cdn_active,
            'is_free' => $user->is_free,
            'last_cdn_payment_intent' => $user->last_cdn_payment_intent,
            'hasPassword' => $user->hasPassword,
        ];
    }

    /**
     * userTotalWebsites
     *
     * @param  mixed $user
     * @param  mixed $staging
     * @return void
     */
    public static function userTotalWebsites($user, $staging = false)
    {
        $query = \App\Models\Website::where('user_id', $user->id);

        if ($user->is_free == 1) {
            $query->where('type', 'free');
        } else {
            $query->where('type', 'pro');
        }

        if($staging) {
            $query->where('is_stage', 0);
        }

        return $query->count();
    }

    /**
     * userTotalFreeWebsites
     *
     * @param  mixed $user
     * @return void
     */
    public static function userTotalFreeWebsites($user)
    {
        $query = \App\Models\Website::where('user_id', $user->id);

        $query->where('type', 'free');

        return $query->count();
    }

    /**
     * fetchStatus
     *
     * @param  mixed $formInput
     * @return void
     */
    public function fetchStatus($formInput)
    {
        $website = \App\Models\Website::where('id', $formInput['website_id'])->where('url', getDomain($formInput['domain']))->first();

        if ($website) {

            $user = \App\Models\User::where('id', $website->user_id)->first();

            $subscription = self::getActiveSubscription($user);

            $paid_amount = (float)\App\Models\BillingHistory::where('user_id', $user->id)
            ->where('type', 'cdn')
            ->where(function ($query) {
                $query->where('status', 'succeeded');
            })
            ->sum('amount_paid');

            $cdn_user_stats = \App\Models\CdnUserStat::where('user_id', $user->id)->select(\DB::raw('SUM(chargeable_volume_amount) as chargeable_volume_amount'), \DB::raw('SUM(chargeable_premium_amount) as chargeable_premium_amount'), \DB::raw('SUM(overusage_premium_bandwidth) as overusage_premium_bandwidth'), \DB::raw('SUM(overusage_volume_bandwidth) as overusage_volume_bandwidth'), \DB::raw('SUM(volume_bandwidth) as volume_bandwidth'), \DB::raw('SUM(premium_bandwidth) as premium_bandwidth'))->first();

            $usage_amount = $cdn_user_stats ? ($cdn_user_stats->chargeable_volume_amount + $cdn_user_stats->chargeable_premium_amount) : 0;

            $balance = round($paid_amount - $usage_amount, 2);

            $cdn_website_stat = \App\Models\CdnZoneStat::where('user_id', $user->id)->where('date', '>=', \Carbon\Carbon::now()->subdays(30))->where('website_id', $website->id)->select(\DB::raw('SUM(volume_bandwidth) as volume_bandwidth'), \DB::raw('SUM(premium_bandwidth) as premium_bandwidth'), 'user_id')->groupBy('website_id', 'user_id')->first();

            if ($subscription) {
                $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);
            } else {
                $plan = array(
                    'name' => "Free",
                    'months' => "1"
                );
            }

            if ($user) {
                return array(
                    'status_code' => 200,
                    'success' => true,
                    'data' => [
                        'name' => $user->first_name.' '.$user->last_name,
                        'cdn_active' => $user->cdn_active,
                        'is_free' => $user->is_free,
                        'cdn_bandwidth' => $cdn_user_stats ? readableBytes((int)$cdn_user_stats->volume_bandwidth + (int)$cdn_user_stats->premium_bandwidth) : '0 b',
                        'website' => array(
                            'id' => $website->id,
                            'domain' => parse_url($website->url, PHP_URL_HOST),
                            'favicon' => Storage::disk('ftp')->url('images/website/'.$website->favicon),
                            'protocol' => get_url_protocol($website->url),
                            'was_pro' => $website->was_pro,
                            'cdn' => $website->cdn_status == 'active' ? $website->cdn : 0,
                            'type' => $website->type,
                            'status' => $website->cdn_status == 'pending' ? 'deploying' : $website->cdn_status,
                            'balance' => $balance,
                            'cdn_bandwidth' => $cdn_website_stat ? readableBytes((int)$cdn_website_stat->volume_bandwidth + $cdn_website_stat->premium_bandwidth) : '0 b',
                            'endpoint_url' => str_replace("{id}", $website->cdn_domain_id, config('services.bunnycdn.endpoint_url'))
                        ),
                        'plan' => $plan,
                        'subscription' => $subscription,
                        'is_trial_used' => self::isTrialUsed($user)
                    ]
                );
            } else {
                return array(
                    'status_code' => 402,
                    'success' => false,
                );
            }
        }

        return array(
            'status_code' => 410,
            'success' => false,
        );
    }

    /**
     * getActiveSubscription
     * @param  mixed $formInput
     * @return object
     */
    public static function getActiveSubscription($user)
    {
        return $user->subscriptions()->whereIn('stripe_status', ['active', 'past_due', 'trialing'])->whereNull('subscriptions.deleted_at')->first();
    }

    /**
     * getActiveSubscriptions
     * @param  mixed $formInput
     * @return void
     */
    public static function getActiveSubscriptions($user)
    {
        return $user->subscriptions()->whereIn('stripe_status', ['active', 'past_due', 'trialing'])->whereNull('subscriptions.deleted_at')->get();
    }

    /**
     * Check if user avail trial
     * @param  mixed $formInput
     * @return void
     */
    public static function isTrialUsed($user)
    {
        return $user->subscriptions()->whereNull('subscriptions.deleted_at')->whereNotNull('trial_ends_at')->count();
    }

    /**
     * addNewsletterEmail
     *
     * @param  mixed $formInput
     * @return void
     */
    public function addNewsletterEmail($formInput)
    {
        $newsletter = \App\Models\NewsletterEmail::where('email', $formInput['email'])->first();

        $token = rand(100000, 999999);

        if ($newsletter) {
            if ($newsletter->status == "pending") {
                $newsletter->redirect = $formInput['redirect'];
                $newsletter->token = $token;
                $newsletter->expire_at = \Carbon\Carbon::now()->addHours(config('auth.passwords.users.expire') / 60);
                $newsletter->save();

                //Send newsletter verification email
                Notification::sendNow($newsletter, new NewsletterEmailVerification($token));
            }
        } else {
            $newsletter = \App\Models\NewsletterEmail::create([
                'email' => $formInput['email'],
                'redirect' => $formInput['redirect'],
                'status' => 'pending',
                'token' => $token,
                'expire_at' => \Carbon\Carbon::now()->addHours(config('auth.passwords.users.expire') / 60)
            ]);

            //Send newsletter verification email
            Notification::sendNow($newsletter, new NewsletterEmailVerification($token));
        }

        return $newsletter;
    }

    /**
     * verifyNewsletterEmail
     *
     * @param  mixed $id
     * @param  mixed $token
     * @return void
     */
    public function verifyNewsletterEmail($id, $token)
    {
        $newsletter = \App\Models\NewsletterEmail::where('token', $token)->where('id', $id)->where('expire_at', '>', date('Y-m-d H:i:s'))->first();
        if ($newsletter) {
            $newsletter->status = "subscribed";
            $newsletter->save();
            return $newsletter;
        } else {
            $newsletter = \App\Models\NewsletterEmail::where('id', $id)->first();
            return $newsletter;
        }
    }

    /**
     * feedback
     *
     * @param  mixed $formInput
     * @return void
     */
    public function feedback($formInput)
    {
        $feedback = \App\Models\Feedback::create([
            'name' => $formInput['name'],
            'email' => $formInput['email'],
            'rating' => $formInput['rating'],
            'type' => $formInput['type'],
            'option' => $formInput['option'],
            'feedback' => $formInput['feedback']
        ]);
        return $feedback;
    }

    /**
     * getGrooveHqProfile
     *
     * @param  mixed $formInput
     * @return void
     */
    public static function getGrooveHqProfile($formInput)
    {
        $user = \App\Models\User::where('email', $formInput['email'])->first();

        if($user && $formInput['api_token'] == config('services.groovehq.api_key')) {

            $country = \App\Models\Country::find($user->country_id);

            $subscription = self::getActiveSubscription($user);

            $plan = $subscription ? PlanRepository::getPlanByPrice($subscription->stripe_price) : 'Free';

            $cdn_premium_bandwidth = is_object($plan) ? ((($plan->cdn_premium_bandwidth * 1000) * 1000) * 1000) : 0;

            $cdn_volume_bandwidth = is_object($plan) ? ((($plan->cdn_volume_bandwidth * 1000) * 1000) * 1000) : 0;

            $last_subscription_payment = \App\Models\BillingHistory::where('user_id', $user->id)->where('type', 'subscription')->whereIn('status', ['succeeded'])->first();

            $last_cdn_payment = \App\Models\BillingHistory::where('user_id', $user->id)->where('type', 'cdn')->whereIn('status', ['succeeded'])->first();

            $renew_on = $subscription ? \Carbon\Carbon::parse($subscription->asStripeSubscription()->current_period_end)->toFormattedDateString() : '';

            $cdn_user_stats = \App\Models\CdnUserStat::where('user_id', $user->id)->whereMonth('date', \Carbon\Carbon::parse(\Carbon\Carbon::now())->month)->select(\DB::raw('SUM(chargeable_volume_amount) as chargeable_volume_amount'), \DB::raw('SUM(chargeable_premium_amount) as chargeable_premium_amount'), \DB::raw('SUM(overusage_premium_bandwidth) as overusage_premium_bandwidth'), \DB::raw('SUM(overusage_volume_bandwidth) as overusage_volume_bandwidth'), \DB::raw('SUM(volume_bandwidth) as volume_bandwidth'), \DB::raw('SUM(premium_bandwidth) as premium_bandwidth'))->first();

            $chargeable_amount = $cdn_user_stats ? ($cdn_user_stats->chargeable_volume_amount + $cdn_user_stats->chargeable_premium_amount) : 0;

            $overusage_bandwidth = $cdn_user_stats ? ($cdn_user_stats->overusage_premium_bandwidth + $cdn_user_stats->overusage_volume_bandwidth) : 0;

            $bandwidth_used = $cdn_user_stats ? ($cdn_user_stats->volume_bandwidth + $cdn_user_stats->premium_bandwidth) : 0;

            $usage_amount = \App\Models\CdnUserStat::where('user_id', $user->id)->select(\DB::raw('SUM(chargeable_volume_amount) as chargeable_volume_amount'), \DB::raw('SUM(chargeable_premium_amount) as chargeable_premium_amount'))->first();

            $cdn_paid_amount = \App\Models\BillingHistory::where('user_id', $user->id)->where('type', 'cdn')->where('status', 'succeeded')->sum('amount_paid');

            $cdn_balance = number_format((abs((float) $cdn_paid_amount - ((float)$usage_amount->chargeable_volume_amount + (float)$usage_amount->chargeable_premium_amount))), 2);

            $bandwidth_available = is_object($plan) ? (((float)$cdn_premium_bandwidth + (float)$cdn_volume_bandwidth) - (float)$bandwidth_used) : 0;

            $bandwidth_volume_available = is_object($plan) ? ((float)$cdn_volume_bandwidth - (float)$cdn_user_stats->volume_bandwidth) : 0;

            $bandwidth_premium_available = is_object($plan) ? ((float)$cdn_premium_bandwidth - (float)$cdn_user_stats->premium_bandwidth) : 0;

            $total_websites = \App\Models\Website::where('user_id', $user->id)->count();

            $total_pro_websites = \App\Models\Website::where('user_id', $user->id)->where('type', 'pro')->count();

            $total_free_websites = \App\Models\Website::where('user_id', $user->id)->where('type', 'free')->count();

            $total_cdn_websites = \App\Models\Website::where('user_id', $user->id)->where('cdn', '1')->count();

            $count_cdn_charges = \App\Models\BillingHistory::where('user_id', $user->id)->where('type', 'cdn')->where('status', 'succeeded')->count();

            $total_cdn_charges = number_format($cdn_paid_amount, 2)." ($count_cdn_charges)";

            $scheduled_for = "";

            if($subscription) {

                $current_period_start = \Carbon\Carbon::parse($subscription->asStripeSubscription()->current_period_start)->toDateString();

                $current_period_end = \Carbon\Carbon::parse($subscription->asStripeSubscription()->current_period_end)->toDateString();

                $current_period_end_display = \Carbon\Carbon::parse($subscription->asStripeSubscription()->current_period_end)->toDateString();

                $previous_subscription = \App\Models\SubscriptionUpdate::whereDate('date', '>=', $current_period_start)->whereDate('date', '<=', $current_period_end)->where('user_id', $user->id)->with(['plan_from', 'plan_to'])->first();

                if($previous_subscription) {
                    $previous_subscription = $previous_subscription->toArray();
                    $scheduled_for = ($previous_subscription['plan_to']['id'] < $previous_subscription['plan_from']['id'] ? 'Downgradation' : 'Upgradation')." to ".$previous_subscription['plan_from']['name']." (".$current_period_end_display.")";
                }

            }

            return array(
                'user_id' => $user->id,
                'account_id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'country' => $country ? $country->name : '',
                'last_login' => \Carbon\Carbon::parse($user->last_login)->toDayDateTimeString(),
                'created_at' => \Carbon\Carbon::parse($user->created_at)->toFormattedDateString(),
                'created_ago' => \Carbon\Carbon::parse($user->created_at)->diffForHumans(),
                'registration_ip' => $user->registration_ip,
                'state' => $user->state,
                'city' => $user->city,
                'image' => $user->image,
                'cdn_active' => $user->cdn_active,
                'is_free' => $user->is_free,
                'plan_name' => is_object($plan) ? $plan->name.($subscription && $user->subscription($subscription->name)->onTrial() ? '(Trial)' : '') : $plan,
                'plan_interval' => is_object($plan) ? ($plan->months == 1 ? 'Monthly' : 'Yearly') : '',
                'last_subscription_payment' => $last_subscription_payment ? $last_subscription_payment->amount_paid : 0,
                'last_subscription_payment_date' => $last_subscription_payment ? \Carbon\Carbon::parse($last_subscription_payment->created_at)->diffForHumans() : 0,
                'last_cdn_payment' => $last_cdn_payment ? $last_cdn_payment->amount_paid : '',
                'last_cdn_payment_date' => $last_cdn_payment ? \Carbon\Carbon::parse($last_cdn_payment->created_at)->diffForHumans() : '',
                'subscribed_at' => $subscription ? \Carbon\Carbon::parse($subscription->created_at)->toFormattedDateString() : '',
                'subscribed_ago' => $subscription ? \Carbon\Carbon::parse($subscription->created_at)->diffForHumans() : '',
                'subscribed_renew_on' => $renew_on,
                'scheduled_for' => $scheduled_for,
                'payment_history' => $user->stripe_id ? 'https://dashboard.stripe.com/customers/'.$user->stripe_id : '',
                'cdn_balance' => $cdn_balance,
                'cdn_paid_amount' => number_format($cdn_paid_amount, 2),
                'total_cdn_charges' => $total_cdn_charges,
                'auto_recharge' => number_format($user->auto_recharge, 2),
                'chargeable_amount' => number_format($chargeable_amount, 2),
                'overusage_bandwidth' => readableBytes($overusage_bandwidth),
                'overusage_premium_bandwidth' => readableBytes($cdn_user_stats->overusage_premium_bandwidth),
                'overusage_volume_bandwidth' => readableBytes($cdn_user_stats->overusage_volume_bandwidth),
                'bandwidth_used' => readableBytes($bandwidth_used),
                'bandwidth_volume_used' => readableBytes($cdn_user_stats->volume_bandwidth),
                'bandwidth_premium_used' => readableBytes($cdn_user_stats->premium_bandwidth),
                'cdn_premium_bandwidth_quota' => readableBytes((float)$cdn_premium_bandwidth),
                'cdn_volume_bandwidth_quota' => readableBytes((float)$cdn_volume_bandwidth),
                'cdn_total_bandwidth_quota' => readableBytes(((float)$cdn_premium_bandwidth + (float)$cdn_volume_bandwidth)),
                'bandwidth_available' => $bandwidth_available > 0 ? readableBytes($bandwidth_available) : 0,
                'bandwidth_volume_available' => $bandwidth_volume_available > 0 ? readableBytes($bandwidth_volume_available) : 0,
                'bandwidth_premium_available' => $bandwidth_premium_available > 0 ? readableBytes($bandwidth_premium_available) : 0,
                'bandwidth_reset_on' => \Carbon\Carbon::now()->addMonth()->firstOfMonth()->toFormattedDateString(),
                'total_websites' => $total_websites,
                'total_pro_websites' => $total_pro_websites,
                'total_free_websites' => $total_free_websites,
                'total_cdn_websites' => $total_cdn_websites,
            );
        } else {
            return [
                'user_not_found' => true
            ];
        }
    }
}
