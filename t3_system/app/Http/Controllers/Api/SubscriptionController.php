<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Get available monthly subscription plans from database
     */
    public function plans()
    {
        // Load plans from subscription_plans table
        $dbPlans = SubscriptionPlan::with('modules')->get();

        $plans = $dbPlans->map(function ($plan) {
            return [
                'id' => $plan->identifier,
                'name' => $plan->subscription_plan_name,
                'price' => 29.99, // Default price, can be fetched from Stripe API
                'currency' => env('CASHIER_CURRENCY', 'usd'),
                'interval' => 'month',
                'stripe_price_id' => $plan->stripe_id,
                'features' => $plan->modules->pluck('name')->toArray() ?: [
                    'Access to all features',
                    'Email support',
                ],
            ];
        });

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
