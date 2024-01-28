<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminLoginHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_login_history', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('admin_id')->nullable()->index('admin_login_history_ibfk_1');
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
        Schema::dropIfExists('admin_login_history');
    }
}
