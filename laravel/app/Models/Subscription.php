<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'name', 'stripe_id', 'stripe_status', 'stripe_price', 'quantity', 'trial_ends_at', 'ends_at', 'failed_attempt'];

    protected $table = 'subscriptions';
}
