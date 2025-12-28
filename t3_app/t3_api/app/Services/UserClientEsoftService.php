<?php

namespace App\Services;

use App\Contract\Services\IClientEsoft;
use App\Models\AbsenceRequest;
use App\Models\Consultant;
use App\Models\Manager;
use App\Models\ManagerConsultant;
use App\Models\Project;
use App\Models\TimeSheet;
use App\Models\User;

class UserClientEsoftService implements IClientEsoft
{
    public static function GetConsultantsOfManager(Manager $manager)
    {
        $consultants = Consultant::whereHas('projects', function ($query) use ($manager) {
            $query->where('manager_id', $manager->id);
        })->with("user")->get();

        return $consultants;
    }
    public static function GetProjectsOfManager(Manager $manager)
    {
        return Project::where("manager_id", $manager->id)->with("project_b_to_b")->get();
    }
    public static function GetCraOfManager(User $user, string $year, string $month)
    {
        return TimeSheet::whereYear("date", $year)
            ->whereMonth("date", $month)
            ->where('user_id', $user->id)
            ->with(["cra", "activite", "time_sheet_ligne", "project"])
            ->get();
    }
    public static function GetAbsenceRequestOfManager(User $user)
    {
        return AbsenceRequest::where("user_id", $user->id)->with("type_absence")->get();
    }
}
