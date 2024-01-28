<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsageTrackingWebsiteThemeProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usage_tracking_website_theme_profile', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->enum('status', ['current', 'other'])->nullable();
            $table->bigInteger('usage_tracking_website_profile_id')->nullable()->index('usage_tracking_website_theme_profile_ibfk_1');
            $table->bigInteger('usage_tracking_theme_profile_id')->nullable()->index('usage_tracking_website_theme_profile_ibfk_2');
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
        Schema::dropIfExists('usage_tracking_website_theme_profile');
    }
}
