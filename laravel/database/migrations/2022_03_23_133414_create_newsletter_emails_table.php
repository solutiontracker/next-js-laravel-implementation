<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewsletterEmailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('newsletter_emails', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('email')->nullable();
            $table->enum('status', ['pending', 'subscribed', 'unsubscribed'])->default('pending')->nullable();
            $table->integer('token')->nullable();
            $table->string('redirect')->nullable();
            $table->timestamp('expire_at')->nullable();
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
        Schema::dropIfExists('newsletter_emails');
    }
}
