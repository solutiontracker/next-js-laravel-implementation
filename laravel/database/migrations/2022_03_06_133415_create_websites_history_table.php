<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebsitesHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('website_history', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('domain')->nullable();
            $table->enum('type', ['pro', 'free'])->nullable();
            $table->boolean('cdn')->nullable();
            $table->bigInteger('website_id')->nullable()->index('website_history_ibfk_1');
            $table->tinyInteger('volume')->nullable()->default(0);
            $table->enum('cdn_status', ['active', 'pending', 'suspended', 'inactive'])->default('active')->nullable();
            $table->date('date')->nullable();
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
        Schema::dropIfExists('website_history');
    }
}
