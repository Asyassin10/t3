<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnumString;
use App\Models\AbsenceRequest;
use App\Models\Activite;
use App\Models\ClientB2B;
use App\Models\Consultant;
use App\Models\CRA;
use App\Models\Facture;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    //

    public function showProfile(Request $request)
    {
        $user = User::find(Auth::id());

        $role = AccountService::getRoleById(role_id: $user->role_id);
        $response = null;
        $response["cras_count"] = CRA::where('user_id', $user->id)->count();
        $response["absences_count"] = AbsenceRequest::where('user_id', $user->id)
            ->count();
        switch ($role->role_name) {
            case RoleEnumString::ClientEsoft->value:
                $response["clients_count"] = ClientB2B::count();
                $response["consultants_count"] = Consultant::count();
                $response["managers_count"] = Manager::count();
                $response["projects_count"] = Project::count();
                $response["factures_count"] = Facture::count();
                $response["activities_count"] = Activite::count();
                break;
        }
        $response["user"] = $user->load('role');
        return response()->json($response);
    }
    public function updateUserData(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
        ]);
        $user = User::find(Auth::id());

        $user->update([
            "email" => $request->email,
            "name" => $request->name,
        ]);
        return response()->json($user->load('role'));
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            "current_password" => "required|string|min:6",
            "new_password" => "required|string|min:6|confirmed",
        ]);
        $user = User::find(Auth::id());
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                "message" => "Current password is incorrect",
            ], 400);
        }
        $user->password = Hash::make($request->new_password);
        $user->save();
        return response()->json([
            "message" => "Password updated successfully",
        ]);
    }
}
