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
        Schema::table('activites', function (Blueprint $table) {
            //
            $table->dropForeign(['consultant_project_id']);

            $table->dropColumn("consultant_project_id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activites', function (Blueprint $table) {
            //
            $table->unsignedBigInteger("consultant_project_id");
            $table->foreign("consultant_project_id")->references("id")->on("consultant_projects")->cascadeOnDelete();
        });
    }
};
