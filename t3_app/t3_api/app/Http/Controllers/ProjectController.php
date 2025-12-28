<?php

namespace App\Http\Controllers;

use App\Enums\ProjectStatusEnum;
use App\Enums\RoleEnumString;
use App\Models\Activite;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\ConsultantProject;
use App\Models\Manager;
use App\Models\Project;
use App\Models\ProjectManager;
use App\Models\TimeSheet;
use App\Models\User;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function GetAllProjects(Request $request): JsonResponse
    {
        $validator = Validator::make($request->query(), [
            'page' => 'nullable|integer|min:1',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $perPage = 4;
        $response = null;
        $user = User::find(Auth::id());

        $page = $request->query("page");

        $role = AccountService::getRoleById(role_id: $user->role_id);
        switch ($role->role_name) {
            case RoleEnumString::Consultant->value:
                $user_consultant = Consultant::where("user_id", $user->id)->first();

                if ($user_consultant) {

                    $response = $user_consultant->projects()->with([
                        "activities",
                        "consultants.user",
                        "project_b_to_b",
                        "managers.user",
                    ])->paginate($perPage, ['*'], 'page', $page);
                }
                break;
            case RoleEnumString::ClientEsoft->value:
                $user_client_esoft = ClientEsoft::where("user_id", $user->id)->first();
                if ($user_client_esoft) {
                    $response = Project::with(["activities", "project_b_to_b", 'consultants.user', "managers.user"])->where("client_esoft_id", $user_client_esoft->id)->paginate($perPage, ['*'], 'page', $page);
                }
                break;
            case RoleEnumString::Manager->value:
                $user_manager = Manager::where("user_id", $user->id)->first();
                if ($user_manager) {
                    $response =     Project::with(["activities", 'consultants.user', "project_b_to_b", "managers.user"])->where("manager_id", $user_manager->id)->paginate($perPage, ['*'], 'page', $page);
                }
                break;
        }



        if (!$response) {
            $response = ExceptionMessagesService::errorUserNotFound();
        }
        return response()->json($response);
    }
    public function GetAllProjectsNonPaginated(): JsonResponse
    {
        $response = null;
        $user = User::find(Auth::id());

        $role = AccountService::getRoleById(role_id: $user->role_id);
        switch ($role->role_name) {
            case RoleEnumString::Consultant->value:
                $user_consultant = Consultant::where("user_id", $user->id)->first();

                if ($user_consultant) {

                    $response = $user_consultant->projects()->with('activities')
                        ->get();
                }
                break;
            case RoleEnumString::ClientEsoft->value:
                $user_client_esoft = ClientEsoft::where("user_id", $user->id)->first();
                if ($user_client_esoft) {
                    $response = Project::where("client_esoft_id", $user_client_esoft->id)
                        ->with('activities')
                        ->get();
                }
                break;
            case RoleEnumString::Manager->value:
                $user_manager = Manager::where("user_id", $user->id)->first();
                if ($user_manager) {
                    $response = Project::where("manager_id", $user_manager->id)
                        ->with('activities')
                        ->get();
                }
                break;
        }



        if (!$response) {
            $response = ExceptionMessagesService::errorUserNotFound();
        }
        return response()->json($response);
    }




    public function GetAllProjectsQuery(): JsonResponse
    {
        $user = User::find(Auth::id());
        $response = null;
        $page = request()->get('page', 1);
        $perPage = 4;
        $role = AccountService::getRoleById(role_id: $user->role_id);
        switch ($role->role_name) {
            case RoleEnumString::Consultant->value:
                $user_consultant = Consultant::where("user_id", $user->id)->first();
                if ($user_consultant) {
                    $response = $user_consultant->projects()->with([
                        "activities",
                        "project_b_to_b",
                        "managers.user",
                    ])->paginate($perPage, ['*'], 'page', $page);
                }
                break;
            case RoleEnumString::ClientEsoft->value:
                $user_client_esoft = ClientEsoft::where("user_id", $user->id)->first();
                if ($user_client_esoft) {
                    $response = Project::with(["activities", "project_b_to_b", 'consultants.user', "managers.user"])->paginate($perPage, ['*'], 'page', $page);
                }
                break;
            case RoleEnumString::Manager->value:
                $user_manager = Manager::where("user_id", $user->id)->first();
                if ($user_manager) {
                    $response =    Project::with(["activities", 'consultants.user', "project_b_to_b", "managers.user"])->where("manager_id", $user_manager->id)->paginate($perPage, ['*'], 'page', $page);
                }
                break;
        }


        if (!$response) {
            $response = ExceptionMessagesService::errorUserNotFound();
        }
        return response()->json($response);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function CreateProject(Request $request): JsonResponse
    {
        $request->validate([
            "client_b2b_id" => "required|numeric",
            "dure" => "required|numeric",
            "project_name" => "required|string|max:255",
            "info" => "required|string|max:255",
            "codeprojet" => "required|string|max:255",
        ]);
        $clientEsoft = ClientEsoft::where("user_id", Auth::id())->first();
        $projet = Project::create([
            "client_b2b_id" => $request->client_b2b_id,
            "codeprojet" => $request->codeprojet,
            "dure" => $request->dure,
            "info" => $request->info,
            "project_name" => $request->project_name,
            "status" => ProjectStatusEnum::Pending->value,
            "client_esoft_id" => $clientEsoft->id,
        ]);

        return response()->json($projet);
    }
    public function AssignProjectToManager(Request $request): JsonResponse
    {
        $request->validate([
            "manager_id" => "required|numeric",
            "project_manager_price_per_day" => "required|numeric",
            // NOSONAR: This rule is ignored intentionally.
            "project_id" => "required|string|max:255",
        ]);
        $project = Project::find($request->project_id);
        if (!$project) {
            return response()->json(["msg" => "project not found"], 404);
        }
        $manager = Manager::find($request->manager_id);
        if (!$manager) {
            return response()->json(["msg" => "manager not found"], 404);
        }
        if ($project->manager_id == $manager->id) {
            return response()->json(["msg" => "manager already assigned to this project"]);
        }
        $project->manager_id = $request->manager_id;
        $project->save();
        ProjectManager::create([
            "project_id" => $project->id,
            "manager_id" => $manager->id,
            "project_manager_price_per_day" => $request->project_manager_price_per_day,
            "date_of_start" => Carbon::now()->toDateString(),
        ]);
        return response()->json(["msg" => "manager assigned from project successfully"]);
    }
    public function UnAssignProjectToManager(Request $request): JsonResponse
    {
        $request->validate([
            "manager_id" => "required|numeric",
            "project_manager_price_per_day" => "required|numeric",
            // NOSONAR: This rule is ignored intentionally.
            "project_id" => "required|string|max:255",
        ]);
        $project = Project::find($request->project_id);
        if (!$project) {
            return response()->json(["msg" => "project not found"], 404);
        }
        $manager = Manager::find($request->manager_id);
        if (!$manager) {
            return response()->json(["msg" => "manager not found"], 404);
        }
        if ($project->manager_id !== $manager->id) {
            return response()->json(["msg" => "manager is not assigned to this project"], 200);
        }
        $project->manager_id = null;
        $project->save();

        $project_manager_relation = ProjectManager::where("project_id", $project->id)->where("manager_id", $manager->id)->first();
        if ($project_manager_relation) {
            $project_manager_relation->date_of_end = Carbon::now()->toDateString();
            $project_manager_relation->save();
        }
        return response()->json(["msg" => "manager unassigned from project successfully"]);
    }
    public function GetAllProjectStatus()
    {
        return response()->json(["status" => ProjectStatusEnum::values()]);
    }
    public function Delete_Project(Request $request, $id): JsonResponse
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Get the authenticated user's clientEsoft
        $clientEsoft = ClientEsoft::where("user_id", Auth::id())->first();

        if (!$clientEsoft) {
            return response()->json(['message' => 'Client is null'], 404);
        }
        if ($project->client_esoft_id !== $clientEsoft->id) {
            return response()->json(['message' => 'You are not authorized to delete this project'], 403);
        }

        /*         TimeSheet::where('project_id', $project->id)->each->delete();
 */


        /*         Activite::where("project_id", $project->id)->delete();
 */
        /*    ConsultantProject::where("project_id", $project->id)->delete();

        ProjectManager::where("project_id", $project->id)->delete(); */

        $project->delete();
        return response()->json(['message' => 'Project deleted successfully']);
    }
}
