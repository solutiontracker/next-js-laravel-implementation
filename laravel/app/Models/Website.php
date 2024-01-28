<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Support\Facades\Storage;

class Website extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['url', 'domain', 'type', 'user_id', 'cdn', 'token', 'zone_identifier', 'cname_identifier', 'ssl', 'cdn_status', 'favicon', 'cdn_domain_id', 'was_pro', 'volume', 'step', 'cdn_hostname', 'is_stage'];

    protected $appends = ['protocol'];

    protected $table = 'websites';

    /**
     * Get the website's favicon.
     *
     * @param  string  $value
     * @return string
     */
    public function getFaviconAttribute($value)
    {
        if(\Route::is('user-website-listing')) {
            return $value ? Storage::disk('ftp')->url('images/website/'.$value) : null;
        } else {
            return $value;
        }
    }

    /**
     * Get the website's url protocol.
     *
     * @param  string  $value
     * @return string
     */
    public function getProtocolAttribute($value)
    {
        return get_url_protocol($this->url);
    }

    /**
     * Get the website's zone rule.
     *
     * @param  string  $value
     * @return string
     */
    public function getZoneRule($zone_id, $rule_type)
    {
        return ZoneRule::where('zone_id', $zone_id)->where('description', $rule_type)->first();
    }
}
