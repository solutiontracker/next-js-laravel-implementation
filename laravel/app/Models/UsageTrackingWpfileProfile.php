<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class UsageTrackingSystemLimitedProfile extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'data_imported_plugins' => 'array',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['version', 'plan_id', 'website_id', 'total_images_compressed', 'total_images_watermarked', 'total_folders_created', 'active_modules', 'total_bytes_saved', 'feedback_id', 'rating_id', 'newsletter_id', 'current_plugin_status', 'active_timestamp', 'deactive_timestamp', 'uninstall_timestamp', 'usage_tracking_disable_timestamp', 'subscription_upgrade_timestamp', 'subscription_downgrade_timestamp', 'account_connection_timestamp', 'installer_step', 'data_imported_plugins', 'usage_tracking_website_profile_id', 'is_tour_guide'];

    protected $table = 'usage_tracking_system_profile';
}
