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
        Schema::dropIfExists('modules');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('modules', function (Blueprint $table) {
            //
            $table->string('controller_namespace')->nullable();
            $table->string("module_name");
            $table->string('full_name')->nullable();
        });

    }
};
