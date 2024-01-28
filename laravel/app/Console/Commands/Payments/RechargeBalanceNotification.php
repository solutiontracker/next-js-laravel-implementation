<?php

namespace App\Console\Commands\Payments;

use Illuminate\Console\Command;

use App\Repositories\SubscriptionRepository;

use App\Repositories\CdnRepository;

use App\Repositories\PlanRepository;

use App\Repositories\UserRepository;

use Illuminate\Support\Facades\Notification;

use App\Notifications\Cdn\User\RechargeBalance;

class RechargeBalanceNotification extends Command
{
    protected $subscriptionRepository;

    protected $cdnRepository;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:recharge-balance-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recharge balance notification';

    /**
     * __construct
     *
     * @param  mixed $subscriptionRepository
     * @param  mixed $cdnRepository
     * @return void
     */
    public function __construct(SubscriptionRepository $subscriptionRepository, CdnRepository $cdnRepository)
    {
        parent::__construct();
        $this->subscriptionRepository = $subscriptionRepository;
        $this->cdnRepository = $cdnRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $users = \App\Models\User::where('status', 'active')->get();

        foreach($users as $user) {

            $subscription = UserRepository::getActiveSubscription($user);

            if($subscription) {

                $usage_amount = \App\Models\CdnUserStat::where('user_id', $user->id)->select(\DB::raw('SUM(chargeable_volume_amount) as chargeable_volume_amount'), \DB::raw('SUM(chargeable_premium_amount) as chargeable_premium_amount'))->first();

                $paid_amount = \App\Models\BillingHistory::where('user_id', $user->id)
                    ->where('type', 'cdn')
                    ->where(function($query) {
                        $query->where(function($query) {
                            $query->whereIn('status', ['succeeded', 'processing'])
                            ->where('created_at', '>=', \Carbon\Carbon::now()->subMinutes(10)->toDateTimeString());
                        });
                        $query->orWhere(function($query) {
                            $query->where('status', 'succeeded');
                        });
                    })
                    ->sum('amount_paid');

                $remaining_balance = round($paid_amount - ($usage_amount->chargeable_volume_amount + $usage_amount->chargeable_premium_amount), 2);

                if($remaining_balance < 5 && $user->cdn_low_balance_alert_count < 4 && $user->auto_recharge == 0) {

                    $atleast_cdn_website = \App\Models\Website::where('user_id', $user->id)->where('type', 'pro')->where('cdn', 1)->where('cdn_status', 'active')->first();

                    $atleast_one_charge = \App\Models\BillingHistory::where('user_id', $user->id)
                    ->where('type', 'cdn')->whereIn('status', ['succeeded'])->first();

                    if($atleast_cdn_website && $atleast_one_charge) {
                        //Notification
                        Notification::sendNow($user, new RechargeBalance());

                        //Update alert
                        $user->cdn_low_balance_alert_at = \Carbon\Carbon::now();
                        $user->cdn_low_balance_alert_count = ($user->cdn_low_balance_alert_count + 1);
                        $user->save();
                    }

                }
            }
        }
    }
}
