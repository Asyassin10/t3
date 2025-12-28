<?php

namespace App\Services;

use App\Models\SubscriptionPlan;

class LoadDefaultDataService
{
    public static function ListAllDefaultModules(): array
    {

        return [
            [
                "module_name" => "CRA",
                "full_name" => "CRA",
                "description" => "Fugiat non tempor excepteur consequat ullamco consectetur elit ullamco. Laboris enim occaecat sint dolor ullamco non eu tempor Lorem proident velit. Anim est deserunt deserunt veniam amet pariatur Lorem. Voluptate aliqua consectetur cillum pariatur.",
                "subscription_plan_id" => SubscriptionPlan::where("subscription_plan_name","plan_principale")->first()->id,
            ],
            [
                "module_name" => "ABS",
                "full_name" => "Absence",
                "description" => "Fugiat non tempor excepteur consequat ullamco consectetur elit ullamco. Laboris enim occaecat sint dolor ullamco non eu tempor Lorem proident velit. Anim est deserunt deserunt veniam amet pariatur Lorem. Voluptate aliqua consectetur cillum pariatur.",
                "subscription_plan_id" => SubscriptionPlan::where("subscription_plan_name","plan_principale")->first()->id,
            ],
            [
                "module_name" => "GFACT",
                "full_name" => "Generation de factire",
                "description" => "Fugiat non tempor excepteur consequat ullamco consectetur elit ullamco. Laboris enim occaecat sint dolor ullamco non eu tempor Lorem proident velit. Anim est deserunt deserunt veniam amet pariatur Lorem. Voluptate aliqua consectetur cillum pariatur.",
                "subscription_plan_id" => SubscriptionPlan::where("subscription_plan_name","plan_principale")->first()->id,
            ],
        ];
    }
    public static function ListAllSubscriptionPlans(): array
    {
        return [
            [
                "subscription_plan_name" => "plan_principale",
                "identifier" => "Basic",
                "stripe_id" => "price_1PQp06LyQPeF2apUcGEsZuUl",
                "id"=>"1"
            ],
        ];
    }
    public static function LoalRoles(): array
    {
        return [
            [
                "role_name" => "Admin",
            ],
            [
                "role_name" => "ClientEsoft",
            ],
        ];
    }
}
