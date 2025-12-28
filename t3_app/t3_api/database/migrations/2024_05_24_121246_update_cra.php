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
        //
        Schema::table('c_r_a_s', function (Blueprint $table) {
            // Change 'jourferiers_date' from dateTime to date
            $table->integer('number_of_days_available')->nullable()->after('id');
            $table->integer('number_of_days_filled')->nullable()->after('id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('c_r_a_s', function (Blueprint $table) {
            // Change 'jourferiers_date' from dateTime to date
            $table->dropColumn('number_of_days_available');
            $table->dropColumn('number_of_days_filled');

        });
        //
    }
};
