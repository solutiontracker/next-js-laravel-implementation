<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToUsageTrackingWebsiteThemeProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('usage_tracking_website_theme_profile', function (Blueprint $table) {
            $table->foreign(['usage_tracking_website_profile_id'], 'usage_tracking_website_theme_profile_ibfk_1')->references(['id'])->on('usage_tracking_website_profile')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['usage_tracking_theme_profile_id'], 'usage_tracking_website_theme_profile_ibfk_2')->references(['id'])->on('usage_tracking_theme_profile')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('usage_tracking_website_theme_profile', function (Blueprint $table) {
            $table->dropForeign('usage_tracking_website_theme_profile_ibfk_1');
            $table->dropForeign('usage_tracking_website_theme_profile_ibfk_2');
        });
    }
}
