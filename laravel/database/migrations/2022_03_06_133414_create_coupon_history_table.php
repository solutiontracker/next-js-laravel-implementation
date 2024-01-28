<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coupon_history', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('coupon_id')->nullable()->index('coupon_history_ibfk_2');
            $table->bigInteger('user_id')->nullable()->index('coupon_history_ibfk_1');
            $table->decimal('amount', 10, 0)->nullable();
            $table->decimal('discount', 10, 0)->nullable();
            $table->string('code')->nullable();
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
        Schema::dropIfExists('coupon_history');
    }
}
