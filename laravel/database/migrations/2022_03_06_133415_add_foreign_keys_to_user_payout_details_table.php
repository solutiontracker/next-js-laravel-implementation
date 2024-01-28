<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToUserPayoutDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_payout_details', function (Blueprint $table) {
            $table->foreign(['user_payout_method_id'], 'user_payout_details_ibfk_1')->references(['id'])->on('user_payout_methods')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_payout_details', function (Blueprint $table) {
            $table->dropForeign('user_payout_details_ibfk_1');
        });
    }
}
