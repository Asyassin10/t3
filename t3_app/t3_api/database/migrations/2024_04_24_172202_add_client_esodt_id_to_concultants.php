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
        Schema::table('consultants', function (Blueprint $table) {
            //
            $table->unsignedBigInteger("client_esoft_id")->nullable();
            $table->foreign("client_esoft_id")->references("id")->on("client_esofts");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultants', function (Blueprint $table) {
            //
            $table->dropForeign(["client_esoft_id"]);
            $table->dropColumn("client_esoft_id");
        });
    }
};
