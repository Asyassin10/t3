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
        Schema::table('time_sheet_lignes', function (Blueprint $table) {
            //
            $table->unsignedBigInteger("time_sheet_id");
            $table->foreign("time_sheet_id")->references("id")->on("time_sheets")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_sheet_lignes', function (Blueprint $table) {
            $table->dropForeign(["time_sheet_id"]);
            $table->dropColumn("time_sheet_id");
        });
    }
};
