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
        Schema::create('client_commercial_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_b2b_id');
            $table->foreign("client_b2b_id")->references("id")->on("client_b2b")->onDelete("cascade");
            $table->text("key");
            $table->text("value");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_commercial_data');
    }
};
