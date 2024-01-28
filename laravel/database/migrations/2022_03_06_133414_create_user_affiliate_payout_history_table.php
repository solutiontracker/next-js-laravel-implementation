<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAffiliatePayoutHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_affiliate_payout_history', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('user_id')->nullable()->index('user_id');
            $table->bigInteger('user_payout_detail_id')->nullable()->index('user_affiliate_payout_history_ibfk_1');
            $table->decimal('amount', 10, 0)->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payout_detail')->nullable();
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
        Schema::dropIfExists('user_affiliate_payout_history');
    }
}
