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
        Schema::create('project_managers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("project_id");
            $table->foreign("project_id")->references("id")->on("projects");
            $table->unsignedBigInteger("manager_id");
            $table->foreign("manager_id")->references("id")->on("managers");
            $table->integer("project_manager_price_per_day");
            $table->date("date_of_start")->nullable();
            $table->date("date_of_end")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_managers');
    }
};
