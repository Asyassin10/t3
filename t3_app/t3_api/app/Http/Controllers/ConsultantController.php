<?php

namespace App\Http\Controllers;

use App\Constants\ValidationConstantList;
use App\Enums\RoleEnumString;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\ConsultantProject;
use App\Models\Manager;
use App\Models\ManagerConsultant;
use App\Models\User;
use App\Notifications\NotifyConcultantCreationAccount;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ConsultantController extends Controller
{


    public function GetConsultants(Request $request): JsonResponse
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
        $user = User::with("role")->find(Auth::id());

        $role = AccountService::getRoleById(role_id: $user->role_id);
        $response = null;
        $page = $request->query("page");

        switch ($role->role_name) {
            case RoleEnumString::ClientEsoft->value;
                $user_client_esoft = ClientEsoft::where("user_id", $user->id)->first();
                if ($user_client_esoft) {
                    $response = Consultant::where('client_esoft_id', $user_client_esoft->id)
                        ->when($request->filled('value'), function ($q) use ($request) {
                            $q->whereHas('user', function ($query) use ($request) {
                                $query->where(function ($sub) use ($request) {
                                    $sub->where('name', 'like', '%' . $request->value . '%')
                                        ->orWhere('email', 'like', '%' . $request->value . '%');
                                });
                            });
                        })
                        ->with(['user'])
                        ->withCount('projects')
                        ->paginate($perPage, ['*'], 'page', $page);
                }
                break;
            case RoleEnumString::Manager->value;
                $manager = Manager::where('user_id', Auth::id())->first();
                if ($manager) {
                    Log::info("manager is : " . json_encode($manager));
                    $response = Consultant::whereHas('projects', function ($query) use ($manager) {
                        $query->where('manager_id', $manager->id);
                    })
                        ->when($request->filled('value'), function ($q) use ($request) {
                            $q->whereHas('user', function ($query) use ($request) {
                                $query->where(function ($sub) use ($request) {
                                    $sub->where('name', 'like', '%' . $request->value . '%')
                                        ->orWhere('email', 'like', '%' . $request->value . '%');
                                });
                            });
                        })
                        ->with('user')
                        ->withCount('projects')
                        ->paginate($perPage, ['*'], 'page', $page);
                    Log::info("data is : " . json_encode($response));
                }

                break;
        }

        if (!is_null($response)) {
            return response()->json($response);
        }

        return response()->json(ExceptionMessagesService::errorInvalidRole());
    }
    public function GetConsultantsNonPaginated(Request $request): JsonResponse
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
        $user = User::with("role")->find(Auth::id());

        $role = AccountService::getRoleById(role_id: $user->role_id);
        $response = null;
        $page = $request->query("page");

        switch ($role->role_name) {
            case RoleEnumString::ClientEsoft->value;
                $user_client_esoft = ClientEsoft::where("user_id", $user->id)->first();
                if ($user_client_esoft) {
                    $response = Consultant::where('client_esoft_id', $user_client_esoft->id)
                        ->when($request->filled('value'), function ($q) use ($request) {
                            $q->whereHas('user', function ($query) use ($request) {
                                $query->where(function ($sub) use ($request) {
                                    $sub->where('name', 'like', '%' . $request->value . '%')
                                        ->orWhere('email', 'like', '%' . $request->value . '%');
                                });
                            });
                        })
                        ->with(['user'])
                        ->withCount('projects')
                        ->get();
                }
                break;
            case RoleEnumString::Manager->value;
                $manager = Manager::where('user_id', Auth::id())->first();
                if ($manager) {
                    Log::info("manager is : " . json_encode($manager));
                    $response = Consultant::whereHas('projects', function ($query) use ($manager) {
                        $query->where('manager_id', $manager->id);
                    })
                        ->when($request->filled('value'), function ($q) use ($request) {
                            $q->whereHas('user', function ($query) use ($request) {
                                $query->where(function ($sub) use ($request) {
                                    $sub->where('name', 'like', '%' . $request->value . '%')
                                        ->orWhere('email', 'like', '%' . $request->value . '%');
                                });
                            });
                        })
                        ->with('user')
                        ->withCount('projects')
                        ->get();
                    Log::info("data is : " . json_encode($response));
                }

                break;
        }

        if (!is_null($response)) {
            return response()->json($response);
        }

        return response()->json(ExceptionMessagesService::errorInvalidRole());
    }


    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function CreateConsultant(Request $request): JsonResponse
    {

        $request->validate([
            'name' => ValidationConstantList::ValidationTextMax,
            'professionality' => ValidationConstantList::ValidationTextMax,
            'email' => 'required|email|max:255|unique:users,email',
        ]);

        $user_client_esoft = ClientEsoft::where("user_id", Auth::id())->first();
        if (!$user_client_esoft) {
            return response()->json(ExceptionMessagesService::errorUserNotFound());
        }
        $password = Str::random(12); // Generates a random 12-character password

        $role = AccountService::getRoleByName(role_name: RoleEnumString::Consultant->value);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            "role_id" => $role->id,
            'password' => Hash::make($password),
            "is_valid" => false,
        ]);
        $concultant = Consultant::create([
            "user_id" => $user->id,
            "professionality" => $request->professionality,
            "client_esoft_id" => $user_client_esoft->id,
        ]);
        $user->notify(new NotifyConcultantCreationAccount($password));

        return response()->json($concultant);
    }
    public function AssignConcultantToProject(Request $request): JsonResponse
    {
        $request->validate([
            "consultant_id" => "required|numeric",
            "price_per_day" => "required|numeric",
            "project_id" => "required|numeric",
        ]);
        $concultant_project = ConsultantProject::where("consultant_id", $request->consultant_id)->where("project_id", $request->project_id)->first();
        if ($concultant_project) {
            return response()->json($concultant_project);
        }
        $concultant_project_created = ConsultantProject::create([
            "consultant_id" => $request->consultant_id,
            "price_per_day" => $request->price_per_day,
            "project_id" => $request->project_id,
        ]);
        return response()->json($concultant_project_created, 201);
    }
}
