<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleEnumString;
use App\Http\Controllers\Controller;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use App\Services\AccountService;
use App\Services\DataServices\GetDataService;
use App\Services\ExceptionMessagesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    public function GetAssignedUsers()
    {
        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);
        if ($role->role_name == RoleEnumString::ClientEsoft->value) {
            $user_client_esoft = ClientEsoft::where("user_id", $user->id)->first();
            if (!$user_client_esoft) {
                return response()->json(ExceptionMessagesService::errorUserNotFound());
            }

            $data = GetDataService::getAssignedUsersAsClientEsoft();
            $users = User::whereIn('id', $data)->with('role')->get();
            return response()->json(data: $users);
        }
        if ($role->role_name == RoleEnumString::Manager->value) {
            $user_manager = Manager::where(column: "user_id", operator: $user->id)->first();
            if (!$user_manager) {
                return response()->json(ExceptionMessagesService::errorUserNotFound());
            }

            $consultantIds = GetDataService::getAssignedUsersAsManager(manager: $user_manager);

            $users = User::whereIn('id', $consultantIds)
                ->with(['role']) // complete the relation here
                ->get();
            return response()->json(data: $users);
        }
        return response()->json(ExceptionMessagesService::errorInvalidRole());
    }
    public function activateAccount(Request $request)
    {
        // Validation de la requête
        $request->validate([
            'token' => 'required|string',
        ]);

        // Recherche de l'utilisateur par le jeton
        $user = User::where('account_token', $request->token)->first();
        if (!$user) {
            return response()->json(['message' => 'resource est invalide.'], 404);
        }

        // Activer l'utilisateur
        $user->is_active = true;
        $user->save();

        return response()->json(['message' => 'Le compte a été activé avec succès.'], 200);
    }
}
