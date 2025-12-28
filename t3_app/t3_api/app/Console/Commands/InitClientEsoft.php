<?php

namespace App\Console\Commands;

use App\Services\AccountService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class InitClientEsoft extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = "app:init-client-esoft";

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Command description";

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $modules_data = [
            [
                "id" => 1,
                "module_name" => "CRA",
                "full_name" => "CRA",
                "description" =>
                    "Fugiat non tempor excepteur consequat ullamco consectetur elit ullamco. Laboris enim occaecat sint dolor ullamco non eu tempor Lorem proident velit. Anim est deserunt deserunt veniam amet pariatur Lorem. Voluptate aliqua consectetur cillum pariatur.",
                "created_at" => "2025-11-27T16:57:31.000000Z",
                "updated_at" => "2025-11-27T16:57:31.000000Z",
                "subscription_plan_id" => 1,
            ],
            [
                "id" => 2,
                "module_name" => "ABS",
                "full_name" => "Absence",
                "description" =>
                    "Fugiat non tempor excepteur consequat ullamco consectetur elit ullamco. Laboris enim occaecat sint dolor ullamco non eu tempor Lorem proident velit. Anim est deserunt deserunt veniam amet pariatur Lorem. Voluptate aliqua consectetur cillum pariatur.",
                "created_at" => "2025-11-27T16:57:31.000000Z",
                "updated_at" => "2025-11-27T16:57:31.000000Z",
                "subscription_plan_id" => 1,
            ],
            [
                "id" => 3,
                "module_name" => "GFACT",
                "full_name" => "Generation de factire",
                "description" =>
                    "Fugiat non tempor excepteur consequat ullamco consectetur elit ullamco. Laboris enim occaecat sint dolor ullamco non eu tempor Lorem proident velit. Anim est deserunt deserunt veniam amet pariatur Lorem. Voluptate aliqua consectetur cillum pariatur.",
                "created_at" => "2025-11-27T16:57:31.000000Z",
                "updated_at" => "2025-11-27T16:57:31.000000Z",
                "subscription_plan_id" => 1,
            ],
        ];
        $data_to_create_enviremenet = [
            "email" => "adam_client_esoft@gmail.com",
            "name" => "adam_client_esoft",
            "password" => "password",
            "modules" => $modules_data,
            "app_api_key" => "sdkfjb-sakjd_dc@ddf",
            "user_subscriptionplan_date_start" => "2020-02-05",
            "user_subscriptionplan_date_end" => "2030-02-05",
        ];
        $acc = new AccountService();
        $acc->InitClientEsoft(
            data_str: json_encode($data_to_create_enviremenet),
        );
        $this->info(string: "user clientesoft created successfully");
    }
}
