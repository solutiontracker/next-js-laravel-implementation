<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToUserAffiliatePayoutHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_affiliate_payout_history', function (Blueprint $table) {
            $table->foreign(['user_payout_detail_id'], 'user_affiliate_payout_history_ibfk_1')->references(['id'])->on('user_payout_details')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['user_id'], 'user_affiliate_payout_history_ibfk_2')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_affiliate_payout_history', function (Blueprint $table) {
            $table->dropForeign('user_affiliate_payout_history_ibfk_1');
            $table->dropForeign('user_affiliate_payout_history_ibfk_2');
        });
    }
}
