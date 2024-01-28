<?php

namespace App\Console\Commands\Payments;

use Illuminate\Console\Command;

use App\Repositories\SubscriptionRepository;

use App\Repositories\CdnRepository;

use App\Repositories\PlanRepository;

use App\Repositories\UserRepository;

use Illuminate\Support\Facades\Notification;

use App\Notifications\Cdn\User\RechargeBalance;

use Laravel\Cashier\Exceptions\IncompletePayment;

class AutoRecharge extends Command
{
    protected $subscriptionRepository;

    protected $cdnRepository;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:auto-recharge-balance';

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

                if($remaining_balance <= (20/100) * $user->auto_recharge && $user->auto_recharge > 0 && $user->cdn_auto_recharge_failed_count == 0) {

                    try {

                        $response = $user->invoiceFor('CDN Recharge',
                        (round(($user->auto_recharge * 100), 2)), [],
                        [
                            'statement_descriptor' => config('services.stripe.payment_prefix')
                        ]
                        );

                        if($response->status == 'paid') {

                            $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);

                            $this->subscriptionRepository->addBalance([
                                'amount' => round($user->auto_recharge, 2),
                                'status' => 'processing',
                                'user_id' => $user->id,
                                'transaction_id' => $response->payment_intent,
                                'invoice_id' => $response->id,
                                'plan_id' => $plan->id
                            ]);
                        }

                        $this->info('Cdn auto recharge successfully');

                    } catch (IncompletePayment $exception) {

                        $plan = PlanRepository::getPlanByPrice($subscription->stripe_price);

                        $this->subscriptionRepository->addBalance([
                            'amount' => round($user->auto_recharge, 2),
                            'status' => 'processing',
                            'user_id' => $user->id,
                            'transaction_id' => $exception->payment->id,
                            'invoice_id' => $exception->payment->invoice->id,
                            'plan_id' => $plan->id,
                            'cdn_auto_recharge' => 1
                        ]);

                        if ($exception->payment->status == "requires_action") {
                            //Save last cdn payment intent for later usage
                            $user->last_cdn_payment_intent = $exception->payment->id;
                        }

                        $user->cdn_auto_recharge_failed_count = ($user->cdn_auto_recharge_failed_count + 1);

                        $user->save();

                        $this->info($exception->getMessage());

                    }

                }

            }
        }
    }
}
