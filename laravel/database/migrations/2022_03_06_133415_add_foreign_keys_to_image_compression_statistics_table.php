<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToImageCompressionStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('image_compression_statistics', function (Blueprint $table) {
            $table->foreign(['website_id'], 'image_compression_statistics_ibfk_1')->references(['id'])->on('websites')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['server_id'], 'image_compression_statistics_ibfk_2')->references(['id'])->on('servers')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('image_compression_statistics', function (Blueprint $table) {
            $table->dropForeign('image_compression_statistics_ibfk_1');
            $table->dropForeign('image_compression_statistics_ibfk_2');
        });
    }
}
