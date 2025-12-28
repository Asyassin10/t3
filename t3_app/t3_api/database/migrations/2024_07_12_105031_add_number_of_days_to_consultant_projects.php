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
        Schema::table('consultant_projects', function (Blueprint $table) {
            //
            $table->integer("price_per_day")->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultant_projects', function (Blueprint $table) {
            //
            $table->dropColumn("price_per_day");
        });
    }
};
