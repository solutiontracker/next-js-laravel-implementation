<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToUserRefferalClicksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_refferal_clicks', function (Blueprint $table) {
            $table->foreign(['country_id'], 'user_refferal_clicks_ibfk_1')->references(['id'])->on('countries')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_refferal_clicks', function (Blueprint $table) {
            $table->dropForeign('user_refferal_clicks_ibfk_1');
        });
    }
}
