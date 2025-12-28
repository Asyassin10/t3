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
        Schema::create('absence_requests', function (Blueprint $table) {
            $table->id();
            $table->integer("nombre_des_jours");
            $table->string("description");
            $table->date("date_debut")->nullable();
            $table->date("date_fin")->nullable();
            $table->date("date_exacte")->nullable();
            $table->date("date_validation")->nullable();
            $table->boolean("is_valid")->default(false);
            $table->unsignedBigInteger("type_absence_id");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absence_requests');
    }
};
