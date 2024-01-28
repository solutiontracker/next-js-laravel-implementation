<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class UsageTrackingWebsiteProfile extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title', 'admin_email', 'site_url', 'home_url', 'timezone', 'site_language', 'multisite', 'environment_type', 'usage_tracking_user_profile_id'];

    protected $table = 'usage_tracking_website_profile';
}
