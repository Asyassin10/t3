<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('api_key_settings', function (Blueprint $table) {
            $table->id();
            $table->string('api_key')->unique();
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_key_settings');
    }
};