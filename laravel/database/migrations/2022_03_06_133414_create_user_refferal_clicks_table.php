<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserRefferalClicksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_refferal_clicks', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('ip')->nullable();
            $table->bigInteger('country_id')->nullable()->index('user_refferal_clicks_ibfk_1');
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('created_at')->nullable();
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
        Schema::dropIfExists('user_refferal_clicks');
    }
}
