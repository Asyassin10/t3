<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnumString;
use App\Models\AbsenceRequest;
use App\Models\Activite;
use App\Models\ClientB2B;
use App\Models\Project;
use App\Models\User;
use App\Services\AccountService;
use App\Services\DataServices\GetDataService;
use App\Services\ExceptionMessagesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{
    public function GlobalSearch(Request $request)
    {
        $validated = Validator::validate($request->query(), [
            "name" => "required|string",
            'page' => 'nullable|integer|min:1',
        ]);
        $searchName = $request->query("name");
        $page = $request->query('page', 1); // default page = 1
        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);
        $response = null;
        $page = $request->query("page");

        switch ($role->role_name) {
            case RoleEnumString::ClientEsoft->value:
                $response = GetDataService::getGlobalSearchDataAsClientEsoft(searchName: $searchName);
                break;
            case RoleEnumString::Manager->value:
                $response = GetDataService::getGlobalSearchDataAsManager(searchName: $searchName);
                break;
            case RoleEnumString::Consultant->value:
                $response = GetDataService::getGlobalSearchDataAsConsultant(searchName: $searchName);
                break;
        }
        if (is_null(value: $response)) {
            return response()->json(data: ExceptionMessagesService::errorInvalidRole());
        }
        return response()->json(data: $response);
    }
}
