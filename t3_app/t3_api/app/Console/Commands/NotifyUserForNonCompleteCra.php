<?php

namespace App\Console\Commands;

use App\Models\ApplicationData;
use App\Models\CRA;
use App\Models\User;
use App\Notifications\NotificationUserForNonCompleteCra;
use Carbon\Carbon;
use Illuminate\Console\Command;

class NotifyUserForNonCompleteCra extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-user-for-non-complete-cra  ';

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
        $day_notification_start_en_each_month = ApplicationData::first()->date_of_start_sending_notifications;

        $current_date = Carbon::now();
        $this->info($current_date->day > $day_notification_start_en_each_month ? "send notification" : "not send notification");

        if ($current_date->day > $day_notification_start_en_each_month) {
            $cras = CRA::whereYear("created_at", $current_date->year)
                ->whereMonth("created_at", $current_date->month)
                ->get();
            foreach ($cras as $cra) {
                if ($cra->progress < 100 && $current_date->day > $day_notification_start_en_each_month) {
                    User::find($cra->user_id)->notify(new NotificationUserForNonCompleteCra());
                }
            }
        }
    }
}
