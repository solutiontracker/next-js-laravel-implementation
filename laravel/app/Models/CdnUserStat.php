<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class CdnUserStat extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'volume_amount', 'premium_amount', 'chargeable_volume_amount', 'overusage_premium_bandwidth', 'overusage_volume_bandwidth', 'chargeable_premium_amount', 'volume_bandwidth', 'premium_bandwidth', 'date'];

    protected $table = 'cdn_user_stats';
}
