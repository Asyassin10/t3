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
            $table->unsignedBigInteger("cra_id");
            $table->foreign("cra_id")->references("id")->on("c_r_a_s")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_sheets', function (Blueprint $table) {
            //
            $table->dropForeign(['cra_id']);
            $table->dropColumn('cra_id');
        });
    }
};
