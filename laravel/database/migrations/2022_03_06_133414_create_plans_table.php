<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('name', 100)->nullable();
            $table->string('stripe_subscription_id', 100)->nullable();
            $table->string('stripe_price_id', 100)->nullable();
            $table->string('alias', 30)->nullable();
            $table->integer('months')->nullable();
            $table->decimal('price', 11)->nullable();
            $table->decimal('saving', 11)->nullable();
            $table->tinyInteger('is_active')->nullable();
            $table->tinyInteger('is_upgrade')->nullable();
            $table->tinyInteger('is_downgrade')->nullable();
            $table->tinyInteger('is_renewal')->nullable();
            $table->text('description')->nullable();
            $table->integer('websites')->nullable();
            $table->integer('cdn_premium_bandwidth')->nullable();
            $table->integer('cdn_volume_bandwidth')->nullable();
            $table->tinyInteger('is_free')->nullable();
            $table->tinyInteger('ltd')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('created_at')->nullable();
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
        Schema::dropIfExists('plans');
    }
}
