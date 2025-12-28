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
        //
        Schema::dropIfExists("client_esoft_modules");
        // client_esoft_modules
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::create('client_esoft_modules', function (Blueprint $table) {
            $table->id();
            // many to many
            $table->unsignedBigInteger("client_esoft_id");
            $table->foreign("client_esoft_id")->references("id")->on("client_esofts");
            // many to many
            $table->unsignedBigInteger("module_id");
            $table->foreign("module_id")->references("id")->on("modules");
            $table->timestamps();
        });
    }
};
