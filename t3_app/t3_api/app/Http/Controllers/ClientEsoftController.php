<?php

namespace App\Http\Controllers;

use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Services\ClientB2BService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Attribute\WithHttpStatus;

class ClientEsoftController extends Controller
{
    public function __construct(
        public ClientB2BService $clientB2BService
    ) {}


    public function deleteB2BClient($id)
    {
        $clientB2B = ClientB2B::find($id);

        if (!$clientB2B) {
            return response()->json(['error' => 'B2B client not found'], 404);
        }

        $clientB2B->delete();
        return response()->json(['message' => 'B2B client and associated projects deleted successfully'], 200);
    }
}
