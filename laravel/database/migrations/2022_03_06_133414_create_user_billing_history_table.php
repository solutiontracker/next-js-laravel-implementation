<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserBillingHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_billing_history', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('user_id')->nullable()->index('user_billing_history_ibfk_1');
            $table->bigInteger('plan_id')->nullable()->index('user_billing_history_ibfk_2');
            $table->string('transaction_id', 100)->nullable();
            $table->string('invoice_id', 50)->nullable();
            $table->decimal('amount_due', 11)->nullable();
            $table->decimal('amount_paid', 11)->nullable();
            $table->decimal('amount_remaining', 11)->nullable();
            $table->bigInteger('coupon_id')->nullable()->index('user_billing_history_ibfk_3');
            $table->string('coupon_code')->nullable();
            $table->boolean('dispute')->nullable();
            $table->string('plan_title', 100)->nullable();
            $table->json('payload')->nullable();
            $table->string('hosted_invoice_url')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('type', ['cdn', 'subscription']);
            $table->enum('status', ['processing', 'succeeded', 'refund'])->nullable();
            $table->boolean('cdn_auto_recharge')->default(false);
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
        Schema::dropIfExists('user_billing_history');
    }
}
