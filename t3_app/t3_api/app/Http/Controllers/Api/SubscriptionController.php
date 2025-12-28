<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SubscriptionController extends Controller
{
    /**
     * Get subscription plans from t3_system
     * This endpoint proxies the request to t3_system so React never directly connects to it
     */
    public function getPlans()
    {
        try {
            $t3SystemUrl = config('app.t3_system_url', 'http://t3_system');

            $response = Http::timeout(10)->get("{$t3SystemUrl}/api/subscription/plans");

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Failed to fetch plans',
                'message' => 'Unable to retrieve subscription plans'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Plans fetch failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
