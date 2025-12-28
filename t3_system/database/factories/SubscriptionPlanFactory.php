<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscriptionplan;
use Carbon\Carbon;
use Illuminate\Support\Str;

class SubscriptionPlanFactory extends Factory
{
    protected $model = SubscriptionPlan::class;

    public function definition()
    {
        return [
            'subscription_plan_name' => "plan_principale",
            'identifier' => "Basic",
            'stripe_id' => "price_1PQp06LyQPeF2apUcGEsZuUl",
        ];

    }

    public function configure()
    {
        return $this->afterCreating(function (SubscriptionPlan $plan) {
        });
    }
}
