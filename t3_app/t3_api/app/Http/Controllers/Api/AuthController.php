<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignedModules;
use App\Models\ClientEsoft;
use App\Models\Module;
use App\Models\User;
use App\Services\AccountService;
use App\Services\FileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function me(Request $request)
    {
        $user = User::find(Auth::id());


        return response()->json($user->load("role"), 200);
    }
    public function updateKbisFile(Request $request)
    {

        $request->validate(
            [
                "file_app" => "required",
            ]
        );
        $user = User::find(Auth::id());
        $kbis_file = null;
        if ($request->hasFile("file_app")) {
            $kbis_file = FileService::StoreFileToPublicPath($request, "kbis_file", "file_app");
        }
        $clientEsoft = ClientEsoft::where("user_id", $user->id)->first();
        $clientEsoft->kbis_file = $kbis_file;
        $clientEsoft->save();
        return response()->json([]);
    }

    /**
     * Login The User
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function loginUser(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);


        if (!Auth::attempt($validated)) {
            return response()->json([
                'status' => false,
                'message' => "L'e-mail et le mot de passe ne correspondent pas à notre dossier.",
            ], 401);
        }

        $user = User::where('email', $request->email)->with("role")->first();

        $account_service = new AccountService();
        $client_esoft = $account_service->GetClientEsoftOfUser($user);
        if (is_null($client_esoft)) {
            return response()->json(data: [
                'status' => false,
                'message' => "L'e-mail et le mot de passe ne correspondent pas à notre dossier.",
            ], status: 401);
        }
        $modules = AssignedModules::all();

        return response()->json([
            'client_esoft' => $client_esoft,
            'user' => $user,
            'status' => true,
            'assigned_modules' => $modules,
            'message' => 'User Logged In Successfully',
            'token' => $user->createToken("API TOKEN")->plainTextToken,
            //   "role" => $user->role
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
