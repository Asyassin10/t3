<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\ApiKeySetting;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscriptionPaye
{
    public function handle(Request $request, Closure $next): Response
    {
        $setting = ApiKeySetting::first();

        if (!$setting || !$setting->api_key) {
            return response()->json([
                'error' => 'API key not configured',
                'require_subscription' => true
            ], 402); // Payment Required
        }

        try {
            $apiUrl = config('app.subscription_api_url');
            
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->timeout(10)->withOptions([
                'allow_redirects' => true  
            ])->post($apiUrl, [
                'api_key' => $setting->api_key,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                $setting->update([
                    'last_checked_at' => now(),
                ]);

                // Check if account is active
                if (isset($data['is_active']) && $data['is_active'] === false) {
                    return response()->json([
                        'error' => 'Account deactivated',
                        'message' => 'Your account has been deactivated. Please contact support.',
                        'require_subscription' => true
                    ], 402);
                }

                // Check if subscription is paid
                if (isset($data['paye']) && $data['paye'] === true) {
                    return $next($request);
                }

                // Subscription not paid
                return response()->json([
                    'error' => 'Subscription not active',
                    'message' => 'Please verify your subscription to continue',
                    'require_subscription' => true
                ], 402); // Payment Required status code
            }

            return response()->json([
                'error' => 'Failed to verify subscription',
                'message' => 'Unable to connect to subscription service',
                'status_code' => $response->status(),
                'require_subscription' => true
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Subscription verification failed',
                'message' => $e->getMessage(),
                'require_subscription' => true
            ], 500);
        }
    }
}