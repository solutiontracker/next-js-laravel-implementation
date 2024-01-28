<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class UsageTrackingWebsitePluginProfile extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['usage_tracking_plugin_profile_id', 'usage_tracking_website_profile_id', 'status'];

    protected $table = 'usage_tracking_website_plugin_profile';
}
