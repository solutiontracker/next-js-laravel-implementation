<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImageCompressionStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('image_compression_statistics', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->bigInteger('website_id')->nullable()->index('image_compression_statistics_ibfk_1');
            $table->string('ip')->nullable();
            $table->string('refferal_link')->nullable();
            $table->integer('image_initial_size')->nullable();
            $table->integer('image_final_size')->nullable();
            $table->enum('size_result', ['increase', 'decreased', 'no-change'])->nullable();
            $table->decimal('image_size_difference_percentile', 10, 0)->nullable();
            $table->boolean('is_watermarked')->nullable();
            $table->string('input_ext')->nullable();
            $table->string('output_ext')->nullable();
            $table->enum('status', ['success', 'failed', 'invalid'])->nullable();
            $table->integer('processing_time')->nullable();
            $table->bigInteger('server_id')->nullable()->index('image_compression_statistics_ibfk_2');
            $table->string('md5')->nullable();
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
        Schema::dropIfExists('image_compression_statistics');
    }
}
