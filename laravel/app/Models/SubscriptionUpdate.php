<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class SubscriptionUpdate extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['plan_from', 'plan_to', 'date', 'user_id'];

    protected $table = 'subscription_updates';

    public function plan_from() {
        return $this->belongsTo(Plan::class, 'plan_from', 'id');
    }

    public function plan_to() {
        return $this->belongsTo(Plan::class, 'plan_to', 'id');
    }
}
