<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class UsageTrackingWebsiteThemeProfile extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['status', 'usage_tracking_website_profile_id', 'usage_tracking_theme_profile_id'];

    protected $table = 'usage_tracking_website_theme_profile';
}
