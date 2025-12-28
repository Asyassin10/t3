<?php

namespace App\Http\Controllers\Api;

use App\Constants\ValidationConstantList;
use App\Enums\RoleEnumString;
use App\Http\Controllers\Controller;
use App\Http\Responses\ResponseUnauthorized;
use App\Models\ClientEsoft;
use App\Models\Manager;
use App\Models\Project;
use App\Models\ProjectManager;
use App\Models\User;
use App\Notifications\NotifyManagerCreationAccount;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use App\Services\UserClientEsoftService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ManagerController extends Controller
{


    public function getManagers(Request $request): JsonResponse
    {
        $validator = Validator::make($request->query(), [
            'page' => 'nullable|integer|min:1',
            "value" => "nullable|max:255",
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $perPage = 4;
        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);
        if ($role->role_name != RoleEnumString::ClientEsoft->value) {
            return response()->json(["msg" => "Invalid user or role"]);
        }
        $page = $request->query('page', 1); // default page = 1

        $userClientEsoft = ClientEsoft::where("user_id", $user->id)->first();

        if (!$userClientEsoft) {
            return response()->json(["msg" => "Client Esoft not found"]);
        }

        $managers = Manager::with(['user'])
            ->where('client_esoft_id', $userClientEsoft->id)
            ->when($request->filled('value'), function ($query) use ($request) {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->value . '%')
                        ->orWhere('email', 'like', '%' . $request->value . '%');
                });
            })
            ->orderByDesc(column: "created_at")
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($managers);
    }
    public function getManagersNonPaginated(): JsonResponse
    {
        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);
        if ($role->role_name != RoleEnumString::ClientEsoft->value) {
            return response()->json(["msg" => "Invalid user or role"]);
        }

        $userClientEsoft = ClientEsoft::where("user_id", $user->id)->first();

        if (!$userClientEsoft) {
            return response()->json(["msg" => "Client Esoft not found"]);
        }

        $managers = Manager::with(['user'])
            ->where('client_esoft_id', $userClientEsoft->id)
            ->orderByDesc(column: "created_at")
            ->get();

        return response()->json($managers);
    }

    public function CreateManager(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ValidationConstantList::ValidationTextMax,
            'email' => 'required|email|max:255|unique:users,email',
        ]);
        $user = User::with("role")->find(Auth::id());

        $role = AccountService::getRoleById(role_id: $user->role_id);
        $user_client_esoft = ClientEsoft::where("user_id", Auth::id())->first();
        if (!$user_client_esoft) {
            return response()->json(ExceptionMessagesService::errorUserNotFound());
        }
        $password = Str::random(12); // Generates a random 12-character password
        $role = AccountService::getRoleByName(role_name: RoleEnumString::Manager->value);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            "role_id" => $role->id,
            'password' => Hash::make($password),
            "is_valid" => false,
        ]);
        $manager = Manager::create([
            "client_esoft_id" => $user_client_esoft->id,
            "user_id" => $user->id,
        ]);

        $user->notify(instance: new NotifyManagerCreationAccount(password: $password));
        return response()->json($manager);
    }

    public function updateManager(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ValidationConstantList::ValidationTextMax,
            'email' => 'required|email|max:255',
            'manager_id' => 'required|integer',
        ]);
        $manager = Manager::find($request->integer("manager_id"));
        if (!$manager) {
            return response()->json(ExceptionMessagesService::ResourceNotFound(resource: "Manager"), 404);
        }
        // Update user record
        $manager->user->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);
        $manager->user->notify(instance: new NotifyManagerCreationAccount(password: $manager->user));

        return response()->json([
            'status'  => true,
            'message' => 'Manager updated successfully',
            'data'    => $manager->load('user'),
        ], 200);
    }
    public function ReNotifyManager(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);
        $user = User::where("email", $request->email)->first();
        if (!$user) {
            return response()->json(ExceptionMessagesService::errorUserNotFound());
        }
        $password = Str::random(12); // Generates a random 12-character password
        $user->notify(new NotifyManagerCreationAccount($password));
        return response()->json([]);
    }
    public function GetConcultantsOfManager()
    {
        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);

        if ($role->role_name != RoleEnumString::Manager->value) {
            return ResponseUnauthorized::toJson();
        }

        $manager = Manager::where("user_id", Auth::id())->first();

        // Make sure the relation name is correct
        $consultants = $manager->consultants()->get();

        return response()->json($consultants);
    }

    public function GetManagerProfileData(Request $request)
    {
        //return response()->json(Auth::user());

        $request->validate([
            "manager_id" => "required|numeric",
            "month" => "required",
            "year" => "required|integer|digits:4|min:2000|max:9999",
        ]);
        // this is a manager
        $user = User::where("id", $request->manager_id)->first();
        if (!$user) {
            return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
        }
        $user_client_esoft = ClientEsoft::where("user_id", Auth::id())->first();
        if (!$user_client_esoft) {
            return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
        }

        $user_manager = Manager::where("client_esoft_id", $user_client_esoft->id)
            ->where("user_id", $user->id)
            ->first();
        if (!$user_manager) {
            return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
        }

        $data = [
            "projects" => UserClientEsoftService::GetProjectsOfManager($user_manager),
            "consultants" => UserClientEsoftService::GetConsultantsOfManager($user_manager),
            "cra" => UserClientEsoftService::GetCraOfManager($user, $request->year, $request->month),
            "absences" => UserClientEsoftService::GetAbsenceRequestOfManager($user),
            "user" => $user,
        ];
        return response()->json($data);
    }

    public function deleteManager(Request $request, $id): JsonResponse
    {
        $manager = Manager::where("user_id", $id)->first();

        // Check if the authenticated user has permission to delete this manager
        $user = User::find(Auth::id());
        if (!$manager) {
            return response()->json(['error' => 'Manager not found'], 404);
        }
        // Check if the manager belongs to the client associated with the authenticated user
        $userClientEsoft = ClientEsoft::where("user_id", $user->id)->first();
        if (!$userClientEsoft || $manager->client_esoft_id !== $userClientEsoft->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        DB::transaction(function () use ($manager) {

            // 1️⃣ Remove manager from project_managers (pivot table)
            ProjectManager::where('manager_id', $manager->id)->delete();

            // 2️⃣ Detach manager from projects (keep projects alive)
            Project::where('manager_id', $manager->id)
                ->update(['manager_id' => null]);

            // 3️⃣ Delete manager
            $manager->delete();
        });

        $manager->delete();

        return response()->json(['message' => 'Manager deleted successfully'], 200);
    }
}
