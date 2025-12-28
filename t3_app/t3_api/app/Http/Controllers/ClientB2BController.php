<?php

namespace App\Http\Controllers;

use App\Constants\ValidationConstantList;
use App\Enums\RoleEnumString;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\User;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ClientB2BController extends Controller
{



    public function GetAllClientB2B(Request $request): JsonResponse
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
        $page = $request->query("page", 1);
        $user_client_esoft = ClientEsoft::where("user_id", Auth::id())->first();
        $perPage = 4;

        if (!$user_client_esoft) {
            return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
        }
        $data = ClientB2B::when($request->filled("value"), function ($q) use ($request) {
            return $q->where("client_b2b_name", "like", "%" . $request->value . "%");
        })
            ->with(["commercialData"])->paginate($perPage, ['*'], 'page', $page);
        return response()->json($data);
    }



    public function CreateB2BClient(Request $request): JsonResponse
    {
        $request->validate([
            "name" => "string|required",
        ]);
        $user_client_esoft = ClientEsoft::where("user_id", Auth::id())->first();

        if (!$user_client_esoft) {
            return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
        }
        $client_b2b = ClientB2B::create([
            "client_esoft_id" => $user_client_esoft->id,
            "client_b2b_name" => $request->name,
        ]);

        return response()->json($client_b2b);
    }
    public function UpdateB2BClient(Request $request, int $id): JsonResponse
    {
        $request->validate([
            "name" => "required|string",
        ]);
        $userClientEsoft = ClientEsoft::where("user_id", Auth::id())->first();
        if (!$userClientEsoft) {
            return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
        }
        $clientB2B = ClientB2B::where("id", $id)
            ->where("client_esoft_id", $userClientEsoft->id) // ensure ownership
            ->first();
        if (!$clientB2B) {
            return response()->json(ExceptionMessagesService::ResourceNotFound(resource: "Client B2B"), 404);
        }
        $clientB2B->update([
            "client_b2b_name" => $request->name,
        ]);
        return response()->json([
            "message" => "Client B2B updated successfully",
            "data" => $clientB2B
        ]);
    }
}
