<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCdnUserStatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cdn_user_stats', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('user_id')->nullable()->index('cdn_user_stats_ibfk_1');
            $table->double('volume_amount', 20, 12)->default(0);
            $table->double('premium_amount', 20, 12)->default(0);
            $table->double('chargeable_volume_amount', 20, 12)->nullable()->default(0);
            $table->double('chargeable_premium_amount', 20, 12)->nullable()->default(0);
            $table->double('volume_bandwidth')->nullable()->default(0);
            $table->double('premium_bandwidth')->nullable()->default(0);
            $table->double('overusage_premium_bandwidth')->nullable()->default(0);
            $table->double('overusage_volume_bandwidth')->nullable()->default(0);
            $table->date('date')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable()->useCurrent();
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
        Schema::dropIfExists('cdn_user_stats');
    }
}
