<?php

namespace App\Console\Commands\Accounts;

use Illuminate\Console\Command;

use App\Repositories\SubscriptionRepository;

use App\Repositories\CdnRepository;

use App\Repositories\UserRepository;

class DeactivateCdn extends Command
{
    protected $subscriptionRepository;

    protected $cdnRepository;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'accounts:deactivate-cdn';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto recharge balance';

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

                //CDN suspended due to incomplete payments
                if($remaining_balance < 0) {

                    $user->cdn_active = 0;
                    $user->save();

                    //Update user all websites origins
                    $this->cdnRepository->updateUserWebsitesZones($user, false, true);

                } else {
                    $user->cdn_active = 1;
                    $user->save();

                    //Update user all websites origins
                    $this->cdnRepository->updateUserWebsitesZones($user, true);
                }
            }
        }

        $this->info('Deactivate cdn cron job run successfully!');
    }
}
