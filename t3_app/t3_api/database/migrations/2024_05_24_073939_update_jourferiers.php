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
        Schema::table('jourferiers', function (Blueprint $table) {
            // Change 'jourferiers_date' from dateTime to date
            $table->date('jourferiers_date')->change();
            // Add 'description' column with text type
            $table->text('description')->nullable();
            $table->integer('number_days')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jourferiers', function (Blueprint $table) {
            // Reverse the 'jourferiers_date' column change
            $table->dateTime('jourferiers_date')->change();
            // Drop the 'description' column
            $table->dropColumn('description');
            $table->dropColumn('number_days');
        });
    }
};
