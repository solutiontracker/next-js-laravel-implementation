<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToAdminLoginHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('admin_login_history', function (Blueprint $table) {
            $table->foreign(['admin_id'], 'admin_login_history_ibfk_1')->references(['id'])->on('admin')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('admin_login_history', function (Blueprint $table) {
            $table->dropForeign('admin_login_history_ibfk_1');
        });
    }
}
