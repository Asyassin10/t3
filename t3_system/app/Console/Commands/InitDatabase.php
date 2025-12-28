<?php

namespace App\Console\Commands;

use App\Models\Module;
use App\Models\Role;
use App\Models\SubscriptionPlan;
use App\Services\LoadDefaultDataService;
use Illuminate\Console\Command;

class InitDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'init-database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        //  $moduleSErvice = new LoadDefaultDataService();
        foreach (LoadDefaultDataService::ListAllSubscriptionPlans() as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['subscription_plan_name' => $plan['subscription_plan_name']], // Unique attribute to check for existing records
                $plan // Attributes to update or create
            );
        }
        foreach (LoadDefaultDataService::ListAllDefaultModules() as $module) {
            Module::updateOrCreate(
                ['module_name' => $module['module_name']], // Unique attribute to check for existing records
                $module // Attributes to update or create
            );
        }
        foreach (LoadDefaultDataService::LoalRoles() as $role) {
            Role::updateOrCreate(
                ['role_name' => $role['role_name']], // Unique attribute to check for existing records
                $role // Attributes to update or create
            );
        }
        $this->info("default values are ok ");
    }
}
