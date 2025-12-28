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
    public function checkSubscriptionStatus(string $apiKey): bool
    {
        $client = AppClientEnvirenement::where('app_api_key', $apiKey)->first();

        if (!$client) {
            return false;
        }

        // If no subscription dates, return false
        if (!$client->user_subscriptionplan_date_start || !$client->user_subscriptionplan_date_end) {
            $this->updatePaymentStatus($client, false);
            return false;
        }

        $now = Carbon::now();
        $endDate = Carbon::parse($client->user_subscriptionplan_date_end);

        // Check if subscription has expired
        if ($now->greaterThan($endDate)) {
            $this->updatePaymentStatus($client, false);
            return false;
        }

        // Subscription is active - return current paye status
        return (bool) $client->paye;
    }
        private function updatePaymentStatus(AppClientEnvirenement $client, bool $status): void
    {
        $client->update(['paye' => $status]);
    }
}
