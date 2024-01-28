<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsageTrackingsystemProfileTable extends Migration
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
            $table->string('version', 11)->nullable();
            $table->integer('plan_id')->default(0)->nullable();
            $table->bigInteger('website_id')->default(0)->nullable();
            $table->integer('total_images_compressed')->default(0)->nullable();
            $table->integer('total_images_watermarked')->default(0)->nullable();
            $table->integer('total_folders_created')->default(0)->nullable();
            $table->integer('active_modules')->default(0)->nullable();
            $table->double('total_bytes_saved')->nullable();
            $table->integer('feedback_id')->default(0)->nullable();
            $table->integer('rating_id')->default(0)->nullable();
            $table->integer('newsletter_id')->default(0)->nullable();
            $table->string('current_plugin_status', 30)->nullable();
            $table->string('active_timestamp', 15)->nullable();
            $table->string('deactive_timestamp', 15)->nullable();
            $table->string('uninstall_timestamp', 15)->nullable();
            $table->string('usage_tracking_disable_timestamp', 15)->nullable();
            $table->string('subscription_upgrade_timestamp', 15)->nullable();
            $table->string('subscription_downgrade_timestamp', 15)->nullable();
            $table->string('account_connection_timestamp', 15)->nullable();
            $table->string('installer_step', 15)->nullable();
            $table->string('data_imported_plugins', 255)->nullable();
            $table->tinyInteger('is_tour_guide')->default(0)->nullable();
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
