<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToUserRefferalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_refferals', function (Blueprint $table) {
            $table->foreign(['user_id'], 'user_refferals_ibfk_1')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['refferal_user_id'], 'user_refferals_ibfk_2')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['country_id'], 'user_refferals_ibfk_3')->references(['id'])->on('countries')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['plan_id'], 'user_refferals_ibfk_4')->references(['id'])->on('plans')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['user_billing_history_id'], 'user_refferals_ibfk_5')->references(['id'])->on('user_billing_history')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_refferals', function (Blueprint $table) {
            $table->dropForeign('user_refferals_ibfk_1');
            $table->dropForeign('user_refferals_ibfk_2');
            $table->dropForeign('user_refferals_ibfk_3');
            $table->dropForeign('user_refferals_ibfk_4');
            $table->dropForeign('user_refferals_ibfk_5');
        });
    }
}
