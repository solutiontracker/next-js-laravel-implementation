<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class CdnOrigin extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'premium_price_per_gigabyte', 'volume_price_per_gigabyte', 'region_code', 'continent_code', 'country_code', 'latitude', 'longitude', 'date', 'premium', 'volume'];

    protected $table = 'cdn_origins';
}
