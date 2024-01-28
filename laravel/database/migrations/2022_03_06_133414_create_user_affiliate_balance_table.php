<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAffiliateBalanceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_affiliate_balance', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->decimal('paid_balance', 10, 0)->nullable();
            $table->decimal('pending_balance', 10, 0)->nullable();
            $table->decimal('approved_balance', 10, 0)->nullable();
            $table->bigInteger('user_id')->nullable()->index('user_affiliate_balance_ibfk_1');
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
        Schema::dropIfExists('user_affiliate_balance');
    }
}
