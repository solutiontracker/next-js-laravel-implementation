<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsageTrackingWebsitePluginProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usage_tracking_website_plugin_profile', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('usage_tracking_plugin_profile_id')->nullable()->index('usage_tracking_website_plugin_profile_ibfk_1');
            $table->bigInteger('usage_tracking_website_profile_id')->nullable()->index('usage_tracking_website_plugin_profile_ibfk_2');
            $table->enum('status', ['active', 'inactive'])->nullable();
            $table->timestamps();
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
        Schema::dropIfExists('usage_tracking_website_plugin_profile');
    }
}
