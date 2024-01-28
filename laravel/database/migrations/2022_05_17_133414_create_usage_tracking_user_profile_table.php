<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsageTrackingUserProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usage_tracking_user_profile', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('first_name', 60)->nullable();
            $table->string('last_name', 60)->nullable();
            $table->string('email', 70)->nullable();
            $table->string('username', 60)->nullable();
            $table->string('user_language', 9)->nullable();
            $table->string('country_code', 4)->nullable();
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
        Schema::dropIfExists('usage_tracking_user_profile');
    }
}
