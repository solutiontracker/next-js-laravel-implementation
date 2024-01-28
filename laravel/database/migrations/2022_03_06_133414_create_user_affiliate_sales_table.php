<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAffiliateSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_affiliate_sales', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('user_id')->nullable()->index('user_affiliate_sales_ibfk_1');
            $table->bigInteger('user_billing_history_id')->nullable()->index('user_affiliate_sales_ibfk_2');
            $table->decimal('commission_amount', 10, 0)->nullable();
            $table->enum('status', ['approved', 'pending', 'dispute'])->nullable();
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
        Schema::dropIfExists('user_affiliate_sales');
    }
}
