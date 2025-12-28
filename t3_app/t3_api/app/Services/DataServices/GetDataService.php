<?php

namespace App\Services\DataServices;

use App\Enums\RoleEnumString;
use App\Models\AbsenceRequest;
use App\Models\Activite;
use App\Models\ClientB2B;
use App\Models\Consultant;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class GetDataService
{
    public static function getAssignedUsersAsClientEsoft(): array
    {
        // get managers
        $managers = Manager::pluck("user_id");
        $consultants = Consultant::pluck("user_id");
        return array_merge($managers->toArray(), $consultants->toArray());
    }
    public static function getAssignedUsersAsManager(Manager $manager): Collection
    {
        $projects = Project::where('manager_id', $manager->id)
            ->with('consultants')
            ->get();
        return $projects
            ->flatMap(fn($project) => $project->consultants->pluck('user_id'))
            ->unique();
    }
    public static function getGlobalSearchDataAsClientEsoft(string $searchName): array
    {
        $activities = Activite::query()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('activity_name', 'like', "%{$valueSearch}%");
            })
            ->latest()
            ->take(5)
            ->get();
        $projects = Project::query()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('project_name', 'like', "%{$valueSearch}%");
            })
            ->latest()
            ->take(5)
            ->get();
        $clients = ClientB2B::query()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('client_b2b_name', 'like', "%{$valueSearch}%");
            })
            ->latest()
            ->take(5)
            ->get();
        $users = User::query()
            ->whereHas('role', function ($query) {
                $query->whereIn('role_name', [
                    RoleEnumString::Manager->value,
                    RoleEnumString::ClientEsoft->value,
                ]);
            })
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('name', 'like', "%{$valueSearch}%")
                    ->orWhere("email", 'like', "%{$valueSearch}%");
            })
            ->with("role")
            ->latest()
            ->take(5)
            ->get()->groupBy(fn($user) => $user->role?->role_name ?? 'No role');
        $absences = AbsenceRequest::query()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('reason', 'like', "%{$valueSearch}%");
            })
            ->latest()
            ->take(5)
            ->get();
        return [
            "absences" => $absences,
            "activities" => $activities,
            "clients" => $clients,
            "projects" => $projects,
            "users" => $users,
        ];
    }
    public static function getGlobalSearchDataAsManager(string $searchName): array
    {
        $user_manager = Manager::where(column: "user_id", operator: Auth::id())->first();

        $consultantIds = static::getAssignedUsersAsManager(manager: $user_manager);
        $activities = Activite::query()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('activity_name', 'like', "%{$valueSearch}%");
            })
            ->latest()
            ->where(function ($query) use ($consultantIds) {
                $query->whereIn("user_id", $consultantIds)
                    ->orWhere("user_id", Auth::id());
            })
            ->take(5)
            ->get();
        // Assuming $manager is an instance of Manager
        $projects = $user_manager->projects()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('project_name', 'like', "%{$valueSearch}%");
            })
            ->latest()
            ->take(5)
            ->get();


        $users = User::query()
            ->whereHas('role', function ($query) {
                $query->whereIn('role_name', [
                    RoleEnumString::Manager->value,
                    RoleEnumString::Consultant->value,
                ]);
            })
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('name', 'like', "%{$valueSearch}%")
                    ->orWhere("email", 'like', "%{$valueSearch}%");
            })
            ->with("role")
            ->where(function ($query) use ($consultantIds) {
                $query->whereIn("id", $consultantIds)
                    ->orWhere("id", Auth::id());
            })
            ->latest()
            ->take(5)
            ->get()->groupBy(fn($user) => $user->role?->role_name ?? 'No role');
        $absences = AbsenceRequest::query()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('reason', 'like', "%{$valueSearch}%");
            })
            ->where(function ($query) use ($consultantIds) {
                $query->whereIn("user_id", $consultantIds)
                    ->orWhere("user_id", Auth::id());
            })
            ->latest()
            ->take(5)
            ->get();
        return [
            "absences" => $absences,
            "activities" => $activities,
            "projects" => $projects,
            "users" => $users,
        ];
    }
    public static function getGlobalSearchDataAsConsultant(string $searchName): array
    {
        $consultant = Consultant::where(column: "user_id", operator: Auth::id())->first();

        /*      $consultantIds = static::getAssignedUsersAsManager(manager: $user_manager); */
        $activities = Activite::query()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('activity_name', 'like', "%{$valueSearch}%");
            })
            ->latest()
            ->where(function ($query) use ($consultant) {
                $query->whereIn("user_id", $consultant->projects()->pluck("project_id"))
                    ->orWhere("user_id", Auth::id());
            })
            ->take(5)
            ->get();
        // Assuming $manager is an instance of Manager
        $projects = $consultant->projects()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('project_name', 'like', "%{$valueSearch}%");
            })
            ->latest()
            ->take(5)
            ->get();



        $absences = AbsenceRequest::query()
            ->when($searchName, function ($query, $valueSearch) {
                $query->where('reason', 'like', "%{$valueSearch}%");
            })
            ->where("user_id", Auth::id())
            ->latest()
            ->take(5)
            ->get();
        return [
            "absences" => $absences,
            "activities" => $activities,
            "projects" => $projects,
        ];
    }
}
