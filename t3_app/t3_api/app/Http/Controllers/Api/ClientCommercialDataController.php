<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleEnumString;
use App\Http\Controllers\Controller;
use App\Models\AppCommercialData;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\User;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientCommercialDataController extends Controller
{
    //
    public function syncClientCommercialDataWithClient(Request $request)
    {
        $request->validate([
            'client_b2b_id' => 'required|exists:client_b2b,id',
            'data' => 'required|array',
            'data.*.key' => 'required|string',
            'data.*.value' => 'required|string',
        ]);
        $clientB2B = ClientB2B::find($request->client_b2b_id);
        if (!$clientB2B) {
            return response()->json(['message' => 'Client B2B not found'], 404);
        }
        // Delete existing commercial data for the client
        $clientB2B->commercialData()->delete();
        // Insert new commercial data
        foreach ($request->data as $item) {
            $clientB2B->commercialData()->create([
                'key' => $item['key'],
                'value' => $item['value'],
            ]);
        }
        return response()->json(['message' => 'Client commercial data synchronized successfully'], 200);
    }
    public function getAppCommercialData(): \Illuminate\Http\JsonResponse
    {

        $data = AppCommercialData::all();
        return response()->json($data);
    }
    public function syncClientCommercialDataForApp(Request $request)
    {
        $request->validate([
            'data' => 'nullable|array',
            'data.*.key' => 'required_with:data|string',
            'data.*.value' => 'required_with:data|string',
        ]);


        // If data is empty or null → delete all
        if (!$request->has('data') || empty($request->data)) {
            AppCommercialData::query()->delete();

            return response()->json([
                'message' => 'Client commercial data cleared successfully'
            ], 200);
        }

        AppCommercialData::query()->delete();
        foreach ($request->data as $item) {
            AppCommercialData::create([
                'key' => $item['key'],
                'value' => $item['value'],
            ]);
        }
        return response()->json(['message' => 'Client commercial data synchronized successfully'], 200);
    }
}
