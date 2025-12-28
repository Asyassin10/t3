<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('c_r_a_s', function (Blueprint $table) {
            //
            $table->float("number_of_days_filled", 8, 1)->change();
            $table->integer("progress");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('c_r_a_s', function (Blueprint $table) {
            //
            $table->integer('number_of_days_filled')->change();
        });
    }
};
