<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToSubscriptionItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscription_items', function (Blueprint $table) {
            $table->foreign(['subscription_id'], 'subscription_items_ibfk_1')->references(['id'])->on('subscriptions')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subscription_items', function (Blueprint $table) {
            $table->dropForeign('subscription_items_ibfk_1');
        });
    }
}
