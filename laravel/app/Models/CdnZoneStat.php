<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class CdnZoneStat extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['volume_bandwidth', 'premium_bandwidth', 'website_id', 'user_id', 'cdn_origin_id', 'date', 'volume_price', 'premium_price'];

    protected $table = 'cdn_zone_stats';
}
