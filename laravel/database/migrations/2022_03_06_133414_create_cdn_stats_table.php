<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCdnStatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cdn_stats', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->date('date')->nullable();
            $table->bigInteger('bandwidth')->nullable()->default(0);
            $table->bigInteger('volume_bandwidth')->nullable()->default(0);
            $table->bigInteger('premium_bandwidth')->nullable()->default(0);
            $table->double('cache_hit_rate_chart', 20, 12)->nullable()->default(0);
            $table->bigInteger('requests_served_chart')->nullable()->default(0);
            $table->bigInteger('pull_requests_pulled_chart')->nullable()->default(0);
            $table->bigInteger('origin_shield_bandwidth_used_chart')->nullable()->default(0);
            $table->bigInteger('origin_shield_internal_bandwidth_used_chart')->nullable()->default(0);
            $table->bigInteger('origin_traffic_chart')->nullable()->default(0);
            $table->bigInteger('origin_response_time_chart')->nullable()->default(0);
            $table->bigInteger('bandwidth_cached_chart')->nullable()->default(0);
            $table->bigInteger('error3xx_chart')->nullable()->default(0);
            $table->bigInteger('error4xx_chart')->nullable()->default(0);
            $table->bigInteger('error5xx_chart')->nullable()->default(0);
            $table->bigInteger('website_id')->index('cdn_stats_ibfk_1');
            $table->bigInteger('user_id')->nullable()->index('cdn_stats_ibfk_2');
            $table->double('volume_price', 20, 12)->nullable()->default(0);
            $table->double('premium_price', 20, 12)->nullable()->default(0);
            $table->integer('cdn_premium_bandwidth')->nullable();
            $table->integer('cdn_volume_bandwidth')->nullable();
            $table->bigInteger('plan_id')->nullable()->index('cdn_stats_ibfk_3');
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
        Schema::dropIfExists('cdn_stats');
    }
}
