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
        Schema::create('consultant_projects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("consultant_id");
            $table->foreign("consultant_id")->references("id")->on("consultants");
            $table->unsignedBigInteger("project_id");
            $table->foreign("project_id")->references("id")->on("projects");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultant_projects');
    }
};
