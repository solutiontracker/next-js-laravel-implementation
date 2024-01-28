<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCdnZoneStatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cdn_zone_stats', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('volume_bandwidth')->nullable()->default(0);
            $table->bigInteger('premium_bandwidth')->nullable()->default(0);
            $table->bigInteger('website_id')->nullable()->index('cdn_zone_stats_ibfk_1');
            $table->bigInteger('user_id')->nullable()->index('cdn_zone_stats_ibfk_3');
            $table->bigInteger('cdn_origin_id')->nullable()->index('cdn_zone_stats_ibfk_2');
            $table->date('date')->nullable();
            $table->double('volume_price', 20, 12)->nullable()->default(0);
            $table->double('premium_price', 20, 12)->nullable()->default(0);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->useCurrent();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cdn_zone_stats');
    }
}
