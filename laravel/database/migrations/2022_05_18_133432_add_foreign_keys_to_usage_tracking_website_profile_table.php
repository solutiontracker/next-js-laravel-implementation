<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToUsageTrackingWebsiteProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('usage_tracking_website_profile', function (Blueprint $table) {
            $table->foreign(['usage_tracking_user_profile_id'], 'usage_tracking_website_profile_ibfk_1')->references(['id'])->on('usage_tracking_user_profile')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('usage_tracking_website_profile', function (Blueprint $table) {
            $table->dropForeign('usage_tracking_website_profile_ibfk_1');
        });
    }
}
