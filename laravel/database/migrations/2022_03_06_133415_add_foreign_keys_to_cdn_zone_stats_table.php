<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToCdnZoneStatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cdn_zone_stats', function (Blueprint $table) {
            $table->foreign(['website_id'], 'cdn_zone_stats_ibfk_1')->references(['id'])->on('websites')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['cdn_origin_id'], 'cdn_zone_stats_ibfk_2')->references(['id'])->on('cdn_origins')->onUpdate('CASCADE');
            $table->foreign(['user_id'], 'cdn_zone_stats_ibfk_3')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cdn_zone_stats', function (Blueprint $table) {
            $table->dropForeign('cdn_zone_stats_ibfk_1');
            $table->dropForeign('cdn_zone_stats_ibfk_2');
            $table->dropForeign('cdn_zone_stats_ibfk_3');
        });
    }
}
