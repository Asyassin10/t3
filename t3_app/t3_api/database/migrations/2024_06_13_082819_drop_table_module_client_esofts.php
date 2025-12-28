<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

//module_client_esofts
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::dropIfExists('module_client_esofts');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::create('module_client_esofts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("module_id");
            $table->foreign("module_id")->references("id")->on("modules");
            $table->unsignedBigInteger("clientesoft_id");
            $table->foreign("clientesoft_id")->references("id")->on("client_esofts");
            $table->boolean("is_active")->default(true);

            $table->timestamps();
        });

    }
};
