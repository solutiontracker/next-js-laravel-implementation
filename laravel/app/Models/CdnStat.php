<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class CdnStat extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['date', 'cache_hit_rate_chart', 'requests_served_chart', 'pull_requests_pulled_chart', 'origin_shield_bandwidth_used_chart', 'origin_shield_internal_bandwidth_used_chart', 'origin_traffic_chart', 'origin_response_time_chart', 'bandwidth_cached_chart', 'user_balance_history_chart', 'error3xx_chart', 'error4xx_chart', 'error5xx', 'website_id', 'user_id', 'volume_price', 'premium_price', 'bandwidth', 'volume_bandwidth', 'premium_bandwidth', 'plan_id', 'cdn_volume_bandwidth', 'cdn_premium_bandwidth'];

    protected $table = 'cdn_stats';
}
