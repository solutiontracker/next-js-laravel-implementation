<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsageTrackingSystemProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usage_tracking_system_profile', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('wordpress_version', 50)->nullable();
            $table->string('webserver', 150)->nullable();
            $table->string('php_version', 100)->nullable();
            $table->string('database_extension',15)->nullable();
            $table->string('database_server_version', 100)->nullable();
            $table->bigInteger('usage_tracking_website_profile_id')->nullable()->index('usage_tracking_system_profile_ibfk_1');
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
        Schema::dropIfExists('usage_tracking_system_profile');
    }
}
