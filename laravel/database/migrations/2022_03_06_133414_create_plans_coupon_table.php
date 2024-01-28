<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansCouponTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plans_coupon', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('coupon_id')->nullable()->index('plans_coupon_ibfk_1');
            $table->bigInteger('plan_id')->nullable()->index('plans_coupon_ibfk_2');
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
        Schema::dropIfExists('plans_coupon');
    }
}
