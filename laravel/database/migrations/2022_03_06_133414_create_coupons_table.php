<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('code')->nullable();
            $table->decimal('discount', 10, 0)->nullable();
            $table->date('date_start')->nullable();
            $table->date('date_end')->nullable();
            $table->enum('type', ['percentage', 'fixed'])->nullable();
            $table->tinyInteger('is_active')->nullable();
            $table->integer('total_uses')->nullable();
            $table->boolean('once_use')->nullable();
            $table->boolean('first_use')->nullable();
            $table->boolean('user_specific')->nullable();
            $table->bigInteger('user_id')->nullable()->index('coupons_ibfk_1');
            $table->boolean('plan_specific')->nullable();
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
        Schema::dropIfExists('coupons');
    }
}
