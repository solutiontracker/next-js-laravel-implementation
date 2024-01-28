<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateZoneRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('zone_rules', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('zone_id', 15)->nullable();
            $table->string('guid', 40)->nullable();
            $table->tinyInteger('action_type')->nullable();
            $table->string('parameter_1', 255)->nullable();
            $table->string('parameter_2', 255)->nullable();
            $table->tinyInteger('trigger_matching_type')->nullable();
            $table->string('description', 10)->nullable();
            $table->tinyInteger('enabled')->default(0);
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
        Schema::dropIfExists('zone_rules');
    }
}
