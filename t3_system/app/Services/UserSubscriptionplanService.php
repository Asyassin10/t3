<?php
namespace App\Services;

use App\Models\AppClientEnvirenement;
use Carbon\Carbon;

class UserSubscriptionplanService
{
    public static function CheckPaymentDateIfItIsPassed($subscription_plan): bool
    {
        $startDate = Carbon::createFromFormat('Y-m-d', $subscription_plan->user_subscriptionplan_date_start);
        $endDate = Carbon::createFromFormat('Y-m-d', $subscription_plan->user_subscriptionplan_date_end);
        $dateToCheck = Carbon::now();
        // Check if the current date is between the start and end dates
        if ($dateToCheck->between($startDate, $endDate)) {
            return true;

        } else {
            return false;

        }
    }
    public function checkSubscriptionStatus(string $apiKey): array
    {
        $client = AppClientEnvirenement::where('app_api_key', $apiKey)->first();

        if (!$client) {
            return [
                'paye' => false,
                'is_active' => false,
            ];
        }

        // Check if account is active
        $isActive = (bool) ($client->is_active ?? true);
        if (!$isActive) {
            return [
                'paye' => false,
                'is_active' => false,
            ];
        }

        // If no subscription dates, return false
        if (!$client->user_subscriptionplan_date_start || !$client->user_subscriptionplan_date_end) {
            $this->updatePaymentStatus($client, false);
            return [
                'paye' => false,
                'is_active' => $isActive,
            ];
        }

        $now = Carbon::now();
        $endDate = Carbon::parse($client->user_subscriptionplan_date_end);

        // Check if subscription has expired
        if ($now->greaterThan($endDate)) {
            $this->updatePaymentStatus($client, false);
            return [
                'paye' => false,
                'is_active' => $isActive,
            ];
        }

        // Subscription is active - return current paye status
        return [
            'paye' => (bool) $client->paye,
            'is_active' => $isActive,
        ];
    }
        private function updatePaymentStatus(AppClientEnvirenement $client, bool $status): void
    {
        $client->update(['paye' => $status]);
    }
}
