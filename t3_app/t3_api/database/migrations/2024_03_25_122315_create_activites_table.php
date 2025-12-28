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
        Schema::create('activites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("consultant_project_id");
            $table->foreign("consultant_project_id")->references("id")->on("consultant_projects")->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activites');
    }
};
