<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCdnOriginsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cdn_origins', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('name', 100)->nullable();
            $table->decimal('premium_price_per_gigabyte', 11)->nullable()->default(0.00);
            $table->decimal('volume_price_per_gigabyte', 11)->nullable()->default(0.00);
            $table->string('region_code', 5)->nullable();
            $table->string('continent_code', 5)->nullable();
            $table->string('country_code', 5)->nullable();
            $table->string('latitude', 20)->nullable();
            $table->string('longitude', 20)->nullable();
            $table->tinyInteger('premium')->default(0);
            $table->tinyInteger('volume')->default(0);
            $table->date('date')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->useCurrent();
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
        Schema::dropIfExists('cdn_origins');
    }
}
