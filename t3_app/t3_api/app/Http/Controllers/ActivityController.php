<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnumString;
use App\Http\Requests\Activities\CreateActivityRequest;
use App\Http\Requests\Activities\UpdateActivityRequest;
use App\Models\Activite;
use App\Models\Consultant;
use App\Models\ConsultantProject;
use App\Models\Manager;
use App\Models\ProjectManager;
use App\Models\User;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function GetAllActivities(): JsonResponse
    {
        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);
        $response = null;
        switch ($role->role_name) {
            case RoleEnumString::ClientEsoft->value:
                $response = Activite::with(["project", "user"])->get();
                break;
            case RoleEnumString::Manager->value:
                $manager = Manager::where("user_id", $user->id)->first();
                if ($manager) {
                    $projects_managers  = ProjectManager::where("manager_id", $manager->id)->get()->pluck("project_id");
                    $response = Activite::with(["project", "user"])
                        ->whereIn("project_id", $projects_managers)
                        ->where("user_id", $user->id)
                        ->get();
                }
                break;
            case RoleEnumString::Consultant->value:
                $consultant = Consultant::where("user_id", $user->id)->first();
                if ($consultant) {
                    $projects_consultant  = ConsultantProject::where("consultant_id", $consultant->id)->get()->pluck("project_id");
                    $response = Activite::with(["project", "user"])
                        ->whereIn("project_id", $projects_consultant)
                        ->where("user_id", $user->id)
                        ->get();
                }
                break;
        }
        if (is_null(value: $response)) {
            return response()->json(data: ExceptionMessagesService::errorInvalidRole());
        }
        return response()->json(data: $response);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function CreateActivity(CreateActivityRequest $request): JsonResponse
    {
        $activity = Activite::create([
            "project_id" => $request->project_id,
            "activity_name" => $request->activity_name,
            'user_id' => Auth::id(),
        ]);

        return response()->json(data: $activity, status: 201);
    }
    public function UpdateActivity(UpdateActivityRequest $request, int $id): JsonResponse
    {
        $activity = Activite::find($id);

        if (!$activity) {
            return response()->json(ExceptionMessagesService::ResourceNotFound(resource: "Activity"), 404);
        }


        $activity->update($request->validated());

        return response()->json(data: $activity, status: 200);
    }
    public function deleteActivity(int $id): JsonResponse
    {

        $activity = Activite::find($id);

        if (!$activity) {
            return response()->json(ExceptionMessagesService::ResourceNotFound(resource: "Activity"), 404);
        }

        $activity->delete();
        return response()->json(data: ["message" => "activity deleted successfully"], status: 200);
    }
}
