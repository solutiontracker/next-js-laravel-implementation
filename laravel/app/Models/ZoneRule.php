<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class ZoneRule extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['zone_id', 'guid', 'action_type', 'parameter_1', 'parameter_2', 'trigger_matching_type', 'description', 'enabled'];

    protected $table = 'zone_rules';
}
