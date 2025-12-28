<?php

use App\Enum\JobAppEnvApplicationStatus;
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
        Schema::create('app_client_envirenements', function (Blueprint $table) {
            $table->id();
            $table->string("email");
            $table->string("name");
            $table->string("password");
            $table->unsignedBigInteger("user_id")->nullable();
            $table->foreign("user_id")->references("id")->on("users");
            // modules -> array
            $table->json('modules')->nullable();

            $table->string("app_api_key");
            $table->date("user_subscriptionplan_date_start");
            $table->date("user_subscriptionplan_date_end");
            $table->string("status")->default(JobAppEnvApplicationStatus::PENDING->value);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_client_envirenements');
    }
};
