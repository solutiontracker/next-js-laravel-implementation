<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToCouponHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coupon_history', function (Blueprint $table) {
            $table->foreign(['user_id'], 'coupon_history_ibfk_1')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['coupon_id'], 'coupon_history_ibfk_2')->references(['id'])->on('coupons')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('coupon_history', function (Blueprint $table) {
            $table->dropForeign('coupon_history_ibfk_1');
            $table->dropForeign('coupon_history_ibfk_2');
        });
    }
}
