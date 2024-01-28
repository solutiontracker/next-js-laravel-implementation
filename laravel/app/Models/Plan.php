<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'stripe_subscription_id', 'stripe_price_id', 'alias', 'months', 'price', 'saving', 'plan_duration_id', 'is_active', 'is_upgrade', 'is_downgrade', 'is_renewal', 'description', 'websites', 'cdn_premium_bandwidth', 'cdn_volume_bandwidth', 'is_free'];

    protected $table = 'plans';
}
