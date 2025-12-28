<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateManagerConsultantTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('manager_consultant', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('manager_id');
            $table->unsignedBigInteger('consultants_id');
            $table->timestamps();
            $table->foreign('manager_id')->references('id')->on('managers')->onDelete('cascade');
            $table->foreign('consultants_id')->references('id')->on('consultants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('manager_consultant');
    }
}
