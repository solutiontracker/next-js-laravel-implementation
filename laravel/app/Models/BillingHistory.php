<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class BillingHistory extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'payload' => 'array',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'plan_id', 'transaction_id', 'invoice_id', 'amount_due', 'amount_paid', 'amount_remaining', 'coupon_id', 'coupon_code', 'dispute', 'plan_title', 'payload', 'hosted_invoice_url', 'start_date', 'end_date', 'type', 'status', 'cdn_auto_recharge'];

    protected $table = 'user_billing_history';

    /**
     * user
     *
     * @return void
     */
    public function user() {
        return $this->belongsTo(User::class);
    }

    /**
     * plan
     *
     * @return void
     */
    public function plan() {
        return $this->belongsTo(Plan::class);
    }
}
