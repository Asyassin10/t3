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
        Schema::create('time_sheet_lignes', function (Blueprint $table) {
            $table->id();
            $table->string("value");
            $table->boolean("is_week_end");
            $table->boolean("is_disabled");
            $table->float("rest_acceptable");
            //$table->unsignedBigInteger("time_sheet_id");
            //$table->foreign("time_sheet_id")->on("id")->references("time_sheets");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_sheet_lignes');
    }
};
