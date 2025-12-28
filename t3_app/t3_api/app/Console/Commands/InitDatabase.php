<?php

namespace App\Console\Commands;

use App\Enums\AbsenceRequestTypeEnum;
use App\Enums\RoleEnum;
use App\Models\AbsenceRequestType;
use App\Models\ApplicationData;
use App\Models\Jourferier;
use App\Models\Role;
use App\Services\DefaultDataLoaderService;
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
    protected $description = 'insert default values in the database when deploying it or clone it';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        foreach (DefaultDataLoaderService::LoadJourFerier() as $holiday) {
            Jourferier::updateOrCreate(
                ['jourferiers_date' => $holiday['date']],
                ['jourferiers_date' => $holiday['date'], 'description' => $holiday['description'], 'number_days' => $holiday['number_days']]
            );
        }

        $default_data_application = DefaultDataLoaderService::LoadDefaultApplicationData();
        $application_data = ApplicationData::first();
        if ($application_data) {
            $application_data->date_of_start_sending_notifications = $default_data_application['date_of_start_sending_notifications'];
            $application_data->save();
        } else {
            ApplicationData::create($default_data_application);
        }

        foreach (RoleEnum::cases() as $role) {
            Role::updateOrCreate(["role_name" => $role->name], ["role_name" => $role->name]);
        }
        foreach (AbsenceRequestTypeEnum::cases() as $absence_type_request) {
            AbsenceRequestType::updateOrCreate(["label_type_absence" => $absence_type_request->value], ["label_type_absence" => $absence_type_request->value]);
        }
        $this->info('Default values inserted successfully');
    }
}
