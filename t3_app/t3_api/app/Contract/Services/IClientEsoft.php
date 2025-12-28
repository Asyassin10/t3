<?php

namespace App\Contract\Services;

use App\Models\Manager;
use App\Models\User;

interface IClientEsoft
{
    public static function GetConsultantsOfManager(Manager $manager);
    public static function GetProjectsOfManager(Manager $manager);
    public static function GetCraOfManager(User $user, string $year, string $month);
    public static function GetAbsenceRequestOfManager(User $user);
}
