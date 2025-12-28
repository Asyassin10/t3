<?php
namespace App\Services;

use Illuminate\Http\JsonResponse;

class HttpResponseBuilderSevice
{
    public function buildJsonResponse($data, $status = 200): JsonResponse
    {
        return response()->json($data, $status);
    }
}
