<?php

namespace App\Jobs;

use App\Enum\JobAppEnvApplicationStatus;
use App\Models\AppClientEnvirenement;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessEnvironmentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public AppClientEnvirenement $environment;

    public function __construct(AppClientEnvirenement $environment)
    {
        $this->environment = $environment;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Processing environment ID: {$this->environment->id}");

        // Set to in-progress
        $this->environment->update([
            'status' => JobAppEnvApplicationStatus::InProgress->value
        ]);

        // -------------------------
        // Do your processing logic here
        // Example: Create VPS, call APIs, etc.
        // -------------------------
        Log::info("Environment ID: {$this->environment->id} is in progress");

        // After finishing
        $this->environment->update([
            'status' => JobAppEnvApplicationStatus::Done->value
        ]);
        Log::info("Finished processing environment ID: {$this->environment->id}");
    }
}
