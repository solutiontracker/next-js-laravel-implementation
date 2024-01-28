<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToUserBillingHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_billing_history', function (Blueprint $table) {
            $table->foreign(['user_id'], 'user_billing_history_ibfk_1')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['plan_id'], 'user_billing_history_ibfk_2')->references(['id'])->on('plans')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['coupon_id'], 'user_billing_history_ibfk_3')->references(['id'])->on('coupons')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_billing_history', function (Blueprint $table) {
            $table->dropForeign('user_billing_history_ibfk_1');
            $table->dropForeign('user_billing_history_ibfk_2');
            $table->dropForeign('user_billing_history_ibfk_3');
        });
    }
}
