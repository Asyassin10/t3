<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiKeySetting;
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

    /**
     * Check subscription status (paye and is_active)
     * Returns the current subscription status for the authenticated user
     */
    public function checkStatus()
    {
        try {
            $setting = ApiKeySetting::first();

            if (!$setting || !$setting->api_key) {
                return response()->json([
                    'paye' => false,
                    'is_active' => false,
                    'message' => 'API key not configured'
                ]);
            }

            $apiUrl = config('app.subscription_api_url');

            $response = Http::timeout(10)->post($apiUrl, [
                'api_key' => $setting->api_key,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'paye' => $data['paye'] ?? false,
                    'is_active' => $data['is_active'] ?? true,
                    'message' => 'Status retrieved successfully'
                ]);
            }

            return response()->json([
                'paye' => false,
                'is_active' => false,
                'message' => 'Failed to verify subscription'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'paye' => false,
                'is_active' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
