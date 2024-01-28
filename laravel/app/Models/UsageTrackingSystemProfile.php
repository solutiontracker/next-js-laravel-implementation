<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class UsageTrackingSystemProfile extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['wordpress_version', 'webserver', 'php_version', 'database_extension', 'database_server_version', 'usage_tracking_website_profile_id'];

    protected $table = 'usage_tracking_system_profile';
}
