<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsageTrackingWebsiteProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usage_tracking_website_profile', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('title')->nullable();
            $table->string('admin_email', 60)->nullable();
            $table->string('site_url', 70)->nullable();
            $table->string('home_url', 70)->nullable();
            $table->string('timezone', 30)->nullable();
            $table->string('site_language', 9)->nullable();
            $table->string('multisite', 10)->nullable();
            $table->string('environment_type', 15)->nullable();
            $table->bigInteger('usage_tracking_user_profile_id')->nullable()->index('usage_tracking_website_profile_ibfk_1');
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
        Schema::dropIfExists('usage_tracking_website_profile');
    }
}
