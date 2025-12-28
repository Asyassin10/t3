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
        Schema::table('absence_requests', function (Blueprint $table) {
            //
            $table->unsignedBigInteger("user_id");
            $table->foreign("user_id")->references("id")->on("users");
            $table->foreign("type_absence_id")->references("id")->on("absence_request_types");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('absence_requests', function (Blueprint $table) {
            //
            $table->dropForeign(["user_id"]);
            $table->dropColumn("user_id");
            $table->dropForeign(["type_absence_id"]);
            $table->dropColumn("type_absence_id");
        });
    }
};
