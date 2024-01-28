<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('phone')->nullable();
            $table->enum('status', ['block', 'active'])->nullable();
            $table->string('refferd_by')->nullable();
            $table->string('origin')->nullable();
            $table->bigInteger('country_id')->nullable()->index('users_ibfk_1');
            $table->string('refferal_id')->nullable();
            $table->string('registration_ip')->nullable();
            $table->string('last_login_ip', 20)->nullable();
            $table->dateTime('last_login')->nullable();
            $table->boolean('is_affiliated')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->string('api_token')->nullable()->unique('api_token');
            $table->string('profession', 50)->nullable();
            $table->string('google_id', 70)->nullable();
            $table->string('facebook_id', 70)->nullable();
            $table->string('wordpress_id', 70)->nullable();
            $table->string('continent', 50)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('city', 50)->nullable();
            $table->text('use_agent')->nullable();
            $table->string('updated_email')->nullable();
            $table->string('image', 50)->nullable();
            $table->boolean('cdn_active')->nullable()->default(true);
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->softDeletes();
            $table->string('stripe_id')->nullable()->index();
            $table->string('pm_type')->nullable();
            $table->decimal('auto_recharge', 11)->nullable()->default(0);
            $table->string('pm_last_four', 4)->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->boolean('is_free')->nullable()->default(true);
            $table->string('last_cdn_payment_intent', 100)->nullable();
            $table->dateTime('cdn_low_balance_alert_at')->nullable();
            $table->tinyInteger('cdn_low_balance_alert_count')->default(0);
            $table->tinyInteger('cdn_auto_recharge_failed_count')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
