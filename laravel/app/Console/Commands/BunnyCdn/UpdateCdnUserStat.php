<?php

namespace App\Console\Commands\BunnyCdn;

use Illuminate\Console\Command;

use App\Repositories\CdnRepository;

use App\Repositories\PlanRepository;

use App\Repositories\UserRepository;

class UpdateCdnUserStat extends Command
{
    protected $cdnRepository;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bunny:update_cdn_user_stat';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update cdn user stats';

    /**
     * __construct
     *
     * @param  mixed $cdnRepository
     * @return void
     */
    public function __construct(CdnRepository $cdnRepository)
    {
        parent::__construct();
        $this->cdnRepository = $cdnRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $date_from = \Carbon\Carbon::now()->subMinutes(120)->toDateString();

        $date_to = \Carbon\Carbon::now()->subMinutes(120)->toDateString();

        $period = \Carbon\CarbonPeriod::create($date_from, $date_to);

        foreach ($period as $key => $current_date) {

            $cdn_stats = \App\Models\CdnStat::whereDate('date', \Carbon\Carbon::parse($current_date)->toDateString())->select(\DB::raw('SUM(bandwidth) as bandwidth'), \DB::raw('SUM(volume_bandwidth) as volume_bandwidth'), \DB::raw('SUM(premium_bandwidth) as premium_bandwidth'), \DB::raw('SUM(volume_price) as volume_price'), \DB::raw('SUM(premium_price) as premium_price'), 'user_id')->groupBy('user_id')->get();

            if (count($cdn_stats) > 0) {

                foreach ($cdn_stats as $cdn_stat) {

                    $plan = \App\Models\CdnStat::whereDate('date', \Carbon\Carbon::parse($current_date)->toDateString())->where('user_id', $cdn_stat->user_id)->first();

                    if ($plan) {

                        $cdn_volume_bandwidth_quota_in_bytes = ((($plan->cdn_volume_bandwidth * 1000) * 1000) * 1000);

                        $cdn_premium_bandwidth_quota_in_bytes = ((($plan->cdn_premium_bandwidth * 1000) * 1000) * 1000);

                        $stats = \App\Models\CdnUserStat::whereDate('date', \Carbon\Carbon::parse($current_date)->toDateString())->where('user_id', $cdn_stat->user_id)->first();

                        if ($stats) {
                            $stats->volume_amount = $cdn_stat->volume_price;
                            $stats->premium_amount = $cdn_stat->premium_price;
                            $stats->volume_bandwidth = $cdn_stat->volume_bandwidth;
                            $stats->premium_bandwidth = $cdn_stat->premium_bandwidth;
                            $cdn_stat->save();
                        } else {
                            $stats = \App\Models\CdnUserStat::create([
                                'user_id' => $cdn_stat->user_id,
                                'date' => \Carbon\Carbon::parse($current_date)->toDateString(),
                                'volume_amount' => $cdn_stat->volume_price,
                                'premium_amount' => $cdn_stat->premium_price,
                                'volume_bandwidth' => $cdn_stat->volume_bandwidth,
                                'premium_bandwidth' => $cdn_stat->premium_bandwidth,
                            ]);
                        }

                        //Calculate [Cycle bandwidth | Chargeable amount]

                        $usage = \App\Models\CdnUserStat::whereMonth('date', \Carbon\Carbon::parse($current_date)->month)->whereDate('date', '<=', $current_date)->select(\DB::raw('SUM(volume_amount) as volume_amount'), \DB::raw('SUM(premium_amount) as premium_amount'), \DB::raw('SUM(volume_bandwidth) as volume_bandwidth'), \DB::raw('SUM(premium_bandwidth) as premium_bandwidth'), 'user_id')->groupBy('user_id')->first();

                        $over_usage = \App\Models\CdnUserStat::whereMonth('date', \Carbon\Carbon::parse($current_date)->month)->whereDate('date', '<', $current_date)->select( \DB::raw('SUM(overusage_premium_bandwidth) as overusage_premium_bandwidth'), \DB::raw('SUM(overusage_volume_bandwidth) as overusage_volume_bandwidth'), 'user_id')->groupBy('user_id')->first();

                        $overusage_volume_bandwidth = $over_usage ? $over_usage->overusage_volume_bandwidth : 0;

                        $overusage_premium_bandwidth = $over_usage ? $over_usage->overusage_premium_bandwidth : 0;

                        if ($usage) {

                            $usage_volume_bandwidth = ($usage->volume_bandwidth - $overusage_volume_bandwidth);

                            if ($usage_volume_bandwidth > $cdn_volume_bandwidth_quota_in_bytes) {

                                $difference_of_over_usage_volume_bandwidth = ($usage_volume_bandwidth - $cdn_volume_bandwidth_quota_in_bytes);

                                $over_usage_volume_bandwidth_percentage = ($difference_of_over_usage_volume_bandwidth / $usage_volume_bandwidth) * 100;

                                $over_usage_volume_amount = ($over_usage_volume_bandwidth_percentage / 100) * $usage->volume_amount;

                                $stats->overusage_volume_bandwidth = $difference_of_over_usage_volume_bandwidth;

                                $stats->chargeable_volume_amount = (float) $over_usage_volume_amount;

                            } else {

                                $stats->overusage_volume_bandwidth = 0;

                                $stats->chargeable_volume_amount = 0;

                            }

                            $usage_premium_bandwidth = ($usage->premium_bandwidth - $overusage_premium_bandwidth);

                            if ($usage_premium_bandwidth > $cdn_premium_bandwidth_quota_in_bytes) {

                                $difference_of_over_usage_premium_bandwidth = ($usage_premium_bandwidth - $cdn_premium_bandwidth_quota_in_bytes);

                                $over_usage_premium_bandwidth_percentage = ($difference_of_over_usage_premium_bandwidth / $usage_premium_bandwidth) * 100;

                                $over_usage_premium_amount = ($over_usage_premium_bandwidth_percentage / 100) * $usage->premium_amount;

                                $stats->overusage_premium_bandwidth = $difference_of_over_usage_premium_bandwidth;

                                $stats->chargeable_premium_amount = (float) $over_usage_premium_amount;

                            } else {

                                $stats->overusage_premium_bandwidth = 0;

                                $stats->chargeable_premium_amount = 0;

                            }
                        }

                        $stats->save();
                    }
                }
            }
        }

        $this->info('User current cycle cdn stats updated successfully!');
    }
}
