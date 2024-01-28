<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebsitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('websites', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->string('url')->nullable();
            $table->string('domain')->nullable();
            $table->string('favicon', 40)->nullable();
            $table->enum('type', ['pro', 'free'])->nullable();
            $table->bigInteger('user_id')->nullable()->index('websites_ibfk_1');
            $table->boolean('cdn')->nullable();
            $table->string('token')->nullable();
            $table->string('zone_identifier', 100)->nullable();
            $table->string('cname_identifier', 60)->nullable();
            $table->tinyInteger('volume')->nullable()->default(0);
            $table->boolean('ssl')->nullable()->default(false);
            $table->enum('cdn_status', ['active', 'pending', 'suspended', 'inactive'])->default('active')->nullable();
            $table->enum('status', ['active', 'permanently_suspended', 'temporarily_suspended'])->default('active')->nullable();
            $table->string('cdn_domain_id', 100)->nullable();
            $table->tinyInteger('step')->default(0)->nullable();
            $table->string('cdn_hostname')->nullable();
            $table->tinyInteger('is_stage')->default(0)->nullable();
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
        Schema::dropIfExists('websites');
    }
}
