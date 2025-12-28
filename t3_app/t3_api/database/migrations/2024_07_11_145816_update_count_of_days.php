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
        Schema::table('time_sheets', function (Blueprint $table) {
            //
            $table->float("count_of_days")->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_sheets', function (Blueprint $table) {
            //
            $table->integer('count_of_days')->change();
        });
    }
};
