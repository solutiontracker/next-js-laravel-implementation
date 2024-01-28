<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserLoginHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_login_history', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('user_id')->nullable()->index('user_login_history_ibfk_1');
            $table->longText('user_agents')->nullable();
            $table->string('ip')->nullable();
            $table->timestamps();
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
        Schema::dropIfExists('user_login_history');
    }
}
