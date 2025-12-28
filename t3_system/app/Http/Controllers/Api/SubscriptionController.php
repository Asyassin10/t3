<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Get available monthly subscription plans
     */
    public function plans()
    {
        // Get plans from database or return hardcoded monthly plans
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
     * Get the current user's subscription status
     */
    public function status(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated',
            ], 401);
        }

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
     * Create a Stripe checkout session for subscription
     */
    public function createCheckout(Request $request)
    {
        $request->validate([
            'price_id' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated',
            ], 401);
        }

        try {
            $checkout = $user->newSubscription('default', $request->price_id)
                ->checkout([
                    'success_url' => env('FRONTEND_URL', 'http://localhost:5177') . '/subscription-success?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url' => env('FRONTEND_URL', 'http://localhost:5177') . '/subscription-required',
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
     * Cancel the current subscription
     */
    public function cancel(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated',
            ], 401);
        }

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

        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated',
            ], 401);
        }

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

        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated',
            ], 401);
        }

        try {
            $url = $user->billingPortalUrl(
                env('FRONTEND_URL', 'http://localhost:5177') . '/app'
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
