<?php

namespace App\Console\Commands;

use App\Enum\JobAppEnvApplicationStatus;
use App\Jobs\ProcessEnvironmentJob;
use App\Models\AppClientEnvirenement;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessPendingEnvironments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-pending-environments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch jobs for all pending app client environments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $pending = AppClientEnvirenement::where('status', JobAppEnvApplicationStatus::PENDING->value)->get();

        if ($pending->isEmpty()) {
            Log::info("No pending environments found.");
            return;
        }

        foreach ($pending as $environment) {
            ProcessEnvironmentJob::dispatch($environment);

            Log::info("Job dispatched for environment ID {$environment->id}");
        }
    }
}
