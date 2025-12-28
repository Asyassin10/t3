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
        Schema::create('c_r_a_s', function (Blueprint $table) {
            $table->id();
            /*     $table->unsignedBigInteger("time_sheet_id");
            $table->foreign("time_sheet_id")->references("id")->on("time_sheets");
          */
            $table->unsignedBigInteger("user_id");
            $table->foreign("user_id")->references("id")->on("users")->cascadeOnDelete();

            $table->boolean("is_sent_to_validation")->default(false);
            $table->boolean("is_validated")->default(false);
            $table->date("date_sent_to_validation")->nullable();
            $table->date("date_validation")->nullable();
            $table->string("status");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_s');
    }
};
