<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('c_r_a_s', function (Blueprint $table) {
            //
            $table->boolean("is_notified")->default(false);
            $table->date('date_of_notified')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('c_r_a_s', function (Blueprint $table) {
            //
            $table->dropColumn('is_notified');
            $table->dropColumn('date_of_notified');
        });
    }
};
