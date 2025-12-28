<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clientesoft', function (Blueprint $table) {
            //
            $table->date('user_subscriptionplan_date_start')->nullable();
            $table->date('user_subscriptionplan_date_end')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clientesoft', function (Blueprint $table) {
            //
            $table->dropColumn('user_subscriptionplan_date_start');
            $table->dropColumn('user_subscriptionplan_date_end');
        });
    }
};
