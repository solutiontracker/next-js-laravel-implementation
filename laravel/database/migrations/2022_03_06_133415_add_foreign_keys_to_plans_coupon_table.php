<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToPlansCouponTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('plans_coupon', function (Blueprint $table) {
            $table->foreign(['coupon_id'], 'plans_coupon_ibfk_1')->references(['id'])->on('coupons')->onUpdate('SET NULL')->onDelete('SET NULL');
            $table->foreign(['plan_id'], 'plans_coupon_ibfk_2')->references(['id'])->on('plans')->onUpdate('SET NULL')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('plans_coupon', function (Blueprint $table) {
            $table->dropForeign('plans_coupon_ibfk_1');
            $table->dropForeign('plans_coupon_ibfk_2');
        });
    }
}
