<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    /**
     * Get the current user's subscription status
     */
    public function status(Request $request)
    {
        $user = $request->user();

        $subscribed = $user->subscribed('default');
        $subscription = $user->subscription('default');

        return response()->json([
            'subscribed' => $subscribed,
            'subscription' => $subscription ? [
                'stripe_status' => $subscription->stripe_status,
                'ends_at' => $subscription->ends_at,
                'on_trial' => $subscription->onTrial(),
                'on_grace_period' => $subscription->onGracePeriod(),
                'canceled' => $subscription->canceled(),
            ] : null,
        ]);
    }

    /**
     * Create a checkout session for subscription
     */
    public function createCheckout(Request $request)
    {
        $request->validate([
            'price_id' => 'required|string',
        ]);

        $user = $request->user();

        try {
            $checkout = $user->newSubscription('default', $request->price_id)
                ->checkout([
                    'success_url' => config('app.frontend_url') . '/subscription-success?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url' => config('app.frontend_url') . '/subscription-required',
                ]);

            return response()->json([
                'checkout_url' => $checkout->url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create checkout session',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available subscription plans
     */
    public function plans()
    {
        // Define your monthly subscription plans
        $plans = [
            [
                'id' => 'basic_monthly',
                'name' => 'Basic Plan',
                'price' => 29.99,
                'currency' => 'usd',
                'interval' => 'month',
                'stripe_price_id' => env('STRIPE_BASIC_MONTHLY_PRICE_ID'),
                'features' => [
                    'Time Tracking (CRA)',
                    'Project Management',
                    'Up to 10 users',
                    'Basic Support',
                ],
            ],
            [
                'id' => 'professional_monthly',
                'name' => 'Professional Plan',
                'price' => 79.99,
                'currency' => 'usd',
                'interval' => 'month',
                'stripe_price_id' => env('STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID'),
                'features' => [
                    'Everything in Basic',
                    'Absence Management',
                    'Invoice Generation',
                    'Up to 50 users',
                    'Priority Support',
                ],
            ],
            [
                'id' => 'enterprise_monthly',
                'name' => 'Enterprise Plan',
                'price' => 199.99,
                'currency' => 'usd',
                'interval' => 'month',
                'stripe_price_id' => env('STRIPE_ENTERPRISE_MONTHLY_PRICE_ID'),
                'features' => [
                    'Everything in Professional',
                    'Unlimited users',
                    'Advanced Analytics',
                    'Custom Integrations',
                    'Dedicated Support',
                ],
            ],
        ];

        return response()->json([
            'plans' => $plans,
        ]);
    }

    /**
     * Cancel the current subscription
     */
    public function cancel(Request $request)
    {
        $user = $request->user();

        if (!$user->subscribed('default')) {
            return response()->json([
                'error' => 'No active subscription found',
            ], 404);
        }

        $user->subscription('default')->cancel();

        return response()->json([
            'message' => 'Subscription canceled successfully',
        ]);
    }

    /**
     * Resume a canceled subscription
     */
    public function resume(Request $request)
    {
        $user = $request->user();

        if (!$user->subscription('default')->onGracePeriod()) {
            return response()->json([
                'error' => 'No subscription to resume',
            ], 404);
        }

        $user->subscription('default')->resume();

        return response()->json([
            'message' => 'Subscription resumed successfully',
        ]);
    }

    /**
     * Get billing portal URL
     */
    public function billingPortal(Request $request)
    {
        $user = $request->user();

        try {
            $url = $user->billingPortalUrl(
                config('app.frontend_url') . '/app'
            );

            return response()->json([
                'url' => $url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create billing portal session',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
