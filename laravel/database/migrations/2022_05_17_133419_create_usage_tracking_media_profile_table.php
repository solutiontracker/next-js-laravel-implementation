<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsageTrackingMediaProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usage_tracking_media_profile', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('active_media_editor', 30)->nullable();
            $table->integer('media_count')->default(0)->nullable();
            $table->bigInteger('usage_tracking_website_profile_id')->nullable()->index('usage_tracking_media_profile_ibfk_1');
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
        Schema::dropIfExists('usage_tracking_media_profile');
    }
}
