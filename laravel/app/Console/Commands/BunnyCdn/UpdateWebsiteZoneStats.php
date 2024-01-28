<?php

namespace App\Console\Commands\BunnyCdn;

use Illuminate\Console\Command;

use App\Repositories\CdnRepository;

use App\Repositories\UserRepository;

use App\Repositories\PlanRepository;

class UpdateWebsiteZoneStats extends Command
{
    protected $cdnRepository;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bunny:update_website_zone_stats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update website cdn zone stats';

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
        $websites = \App\Models\Website::whereNotNull('zone_identifier')->withTrashed()->get();

        $date_from = \Carbon\Carbon::now()->subMinutes(120)->toDateString();

        $date_to = \Carbon\Carbon::now()->subMinutes(120)->toDateString();

        $period = \Carbon\CarbonPeriod::create($date_from, $date_to);

        $volumes = array('EU: Amsterdam, NL', 'EU: Frankfurt, DE', 'EU: Paris, FR', 'NA: Chicago, IL', 'NA: Dallas, TX', 'NA: Los Angeles, CA', 'NA: Miami, FL', 'Asia: Singapore, SG', 'Asia: Singapore 2, SG');

        foreach ($period as $current_date) {
            $request = [
                'api_key' => config('services.bunnycdn.apiKey'),
                'dateFrom' => \Carbon\Carbon::parse($current_date)->toDateString(),
                'dateTo' => \Carbon\Carbon::parse($current_date)->toDateString(),
            ];

            if (count($websites) > 0) {
                foreach ($websites as $website) {

                    $count = \App\Models\CdnStat::where('website_id', $website->id)->where('date', \Carbon\Carbon::parse($current_date)->toDateString())->count();

                    if((\Carbon\Carbon::parse($current_date)->toDateString() == \Carbon\Carbon::now()->toDateString() && $website->cdn == 1 && $website->cdn_status == 'active') || (\Carbon\Carbon::parse($current_date)->toDateString() != \Carbon\Carbon::now()->toDateString())) {

                        $user = \App\Models\User::where('id', $website->user_id)->first();

                        $subscription = $user ? UserRepository::getActiveSubscription($user) : null;

                        $plan = ($subscription && $subscription->name ? PlanRepository::getPlanByPrice($subscription->stripe_price) : null);

                        $request['zone_id'] = $website->zone_identifier;

                        $stats = $this->cdnRepository->getZoneStats($request);

                        if ($stats['success']) {
                            $stats = (array)$stats['response'];

                            if ($stats['TotalBandwidthUsed'] > 0) {
                                if (count($stats['BandwidthUsedChart']) > 0) {
                                    foreach ($stats['BandwidthUsedChart'] as $date => $bandwidth) {
                                        \App\Models\CdnStat::where('website_id', $website->id)->where('date', \Carbon\Carbon::parse($date)->toDateString())->forceDelete();
                                        $cdnStats = \App\Models\CdnStat::create([
                                            'website_id' => $website->id,
                                            'user_id' => $website->user_id,
                                            'plan_id' => $plan->id,
                                            'cdn_volume_bandwidth' => $plan->cdn_volume_bandwidth,
                                            'cdn_premium_bandwidth' => $plan->cdn_premium_bandwidth,
                                            'date' => \Carbon\Carbon::parse($date)->toDateString(),
                                            'bandwidth' => $bandwidth,
                                            'cache_hit_rate_chart' => isset($stats['CacheHitRateChart'][$date]) ? $stats['CacheHitRateChart'][$date] : 0,
                                            'requests_served_chart' => isset($stats['RequestsServedChart'][$date]) ? $stats['RequestsServedChart'][$date] : 0,
                                            'pull_requests_pulled_chart' => isset($stats['PullRequestsPulledChart'][$date]) ? $stats['PullRequestsPulledChart'][$date] : 0,
                                            'origin_shield_bandwidth_used_chart' => isset($stats['OriginShieldBandwidthUsedChart'][$date]) ? $stats['OriginShieldBandwidthUsedChart'][$date] : 0,
                                            'origin_shield_internal_bandwidth_used_chart' => isset($stats['OriginShieldInternalBandwidthUsedChart'][$date]) ? $stats['OriginShieldInternalBandwidthUsedChart'][$date] : 0,
                                            'origin_traffic_chart' => isset($stats['OriginTrafficChart'][$date]) ? $stats['OriginTrafficChart'][$date] : 0,
                                            'origin_response_time_chart' => isset($stats['OriginResponseTimeChart'][$date]) ? $stats['OriginResponseTimeChart'][$date] : 0,
                                            'bandwidth_cached_chart' => isset($stats['BandwidthCachedChart'][$date]) ? $stats['BandwidthCachedChart'][$date] : 0,
                                            'error3xx_chart' => isset($stats['Error3xxChart'][$date]) ? $stats['Error3xxChart'][$date] : 0,
                                            'error4xx_chart' => isset($stats['Error4xxChart'][$date]) ? $stats['Error4xxChart'][$date] : 0,
                                            'error5xx_chart' => isset($stats['Error5xxChart'][$date]) ? $stats['Error5xxChart'][$date] : 0,
                                        ]);
                                    }
                                }

                                //Website settings logs
                                $history = \App\Models\WebsiteHistory::where('website_id', $website->id)->where('date', \Carbon\Carbon::parse($current_date)->toDateString())->first();
                                if (!$history) {
                                    $history = \App\Models\WebsiteHistory::create([
                                        'website_id' => $website->id,
                                        'domain' => $website->domain,
                                        'type' => $website->type,
                                        'cdn' => $website->cdn,
                                        'cdn_status' => $website->cdn_status,
                                        'volume' => $website->volume,
                                        'date' => \Carbon\Carbon::parse($current_date)->toDateString()
                                    ]);
                                } elseif (\Carbon\Carbon::parse($current_date)->toDateString() == \Carbon\Carbon::now()->toDateString()) {
                                    $history->domain = $website->domain;
                                    $history->type = $website->type;
                                    $history->cdn = $website->cdn;
                                    $history->cdn_status = $website->cdn_status;
                                    $history->volume = $website->volume;
                                    $history->save();
                                }

                                if (count($stats['GeoTrafficDistribution']) > 0) {
                                    foreach ($stats['GeoTrafficDistribution'] as $origin => $bandwidth) {

                                        $cdn_origin = \App\Models\CdnOrigin::where('name', $origin)->where('date', \Carbon\Carbon::parse($current_date)->toDateString())->first();

                                        if ($cdn_origin) {
                                            if ($history->volume == 1 && in_array($cdn_origin->name, $volumes)) {
                                                $volume_price_per_byte = (($cdn_origin->volume_price_per_gigabyte / 1000) /1000) / 1000;
                                                $volume_price = $bandwidth * $volume_price_per_byte;
                                                $premium_price = 0;
                                                $volume_bandwidth = $bandwidth;
                                                $premium_bandwidth = 0;
                                            } else {
                                                $premium_price_per_byte = (($cdn_origin->premium_price_per_gigabyte / 1000) /1000) / 1000;
                                                $premium_price = $bandwidth * $premium_price_per_byte;
                                                $volume_price = 0;
                                                $volume_bandwidth = 0;
                                                $premium_bandwidth = $bandwidth;
                                            }

                                            \App\Models\CdnZoneStat::where('website_id', $website->id)->where('cdn_origin_id', $cdn_origin->id)->where('date', \Carbon\Carbon::parse($current_date)->toDateString())->forceDelete();

                                            \App\Models\CdnZoneStat::create([
                                                'volume_bandwidth' => $volume_bandwidth,
                                                'premium_bandwidth' => $premium_bandwidth,
                                                'volume_price' => $volume_price,
                                                'premium_price' => $premium_price,
                                                'website_id' => $website->id,
                                                'user_id' => $website->user_id,
                                                'cdn_origin_id' => $cdn_origin->id,
                                                'date' => \Carbon\Carbon::parse($current_date)->toDateString()
                                            ]);
                                        }
                                    }
                                }

                                //Calculate prices [website date wise]
                                $row = \App\Models\CdnZoneStat::where('website_id', $website->id)->where('date', \Carbon\Carbon::parse($date)->toDateString())->select(\DB::raw('SUM(volume_price) as volume_price'), \DB::raw('SUM(premium_price) as premium_price'), \DB::raw('SUM(volume_bandwidth) as volume_bandwidth'), \DB::raw('SUM(premium_bandwidth) as premium_bandwidth'))->first();

                                if ($row && $cdnStats) {
                                    $cdnStats->premium_price = $row->premium_price;
                                    $cdnStats->volume_price = $row->volume_price;
                                    $cdnStats->volume_bandwidth = $row->volume_bandwidth;
                                    $cdnStats->premium_bandwidth = $row->premium_bandwidth;
                                    $cdnStats->save();
                                }
                            }
                        }
                    }

                }
            }
        }

        $this->info('Stats updated successfully!');
    }
}
