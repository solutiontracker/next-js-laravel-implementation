<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'code', 'discount', 'date_start', 'date_end', 'type', 'is_active', 'total_uses', 'once_use', 'first_use', 'user_specific', 'user_id', 'plan_specific'];

    protected $table = 'coupons';
}
