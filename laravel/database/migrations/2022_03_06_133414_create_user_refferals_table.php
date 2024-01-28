<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserRefferalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_refferals', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('user_id')->nullable()->index('user_refferals_ibfk_1');
            $table->string('refferal_id')->nullable();
            $table->bigInteger('refferal_user_id')->nullable()->index('user_refferals_ibfk_2');
            $table->bigInteger('plan_id')->nullable()->index('user_refferals_ibfk_4');
            $table->bigInteger('user_billing_history_id')->nullable()->index('user_refferals_ibfk_5');
            $table->timestamp('register_at')->nullable();
            $table->bigInteger('country_id')->nullable()->index('user_refferals_ibfk_3');
            $table->decimal('commission_amount', 10, 0)->nullable();
            $table->integer('percentage')->nullable();
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
        Schema::dropIfExists('user_refferals');
    }
}
