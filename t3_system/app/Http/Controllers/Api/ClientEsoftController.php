<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscriptionplan;
use App\Services\UserSubscriptionplanService;
use Illuminate\Http\Request;

class ClientEsoftController extends Controller
{

    protected $subscriptionService;

    public function __construct(UserSubscriptionplanService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }
    //
    public function getAbonnements(Request $request)
    {
        $user = $request->attributes->get('user');
        $data = UserSubscriptionplan::where("user_id", $user->id)->with(["subscription_plan.modules", "user"])->get();
        foreach ($data as $d) {
            $d["is_payed"] = UserSubscriptionplanService::CheckPaymentDateIfItIsPassed($d);

        }

        return response()->json($data);

    }
    public function getModules(Request $request)
    {
        $user = $request->attributes->get('user');

        $data = SubscriptionPlan::with("modules")->get();
        foreach ($data as $d) {
            $subscription_plan = UserSubscriptionplan::where("user_id", $user->id)->where("subscription_plan_id", $d->id)->first();
            if ($subscription_plan) {

                $d["is_payed"] = UserSubscriptionplanService::CheckPaymentDateIfItIsPassed($subscription_plan);

            } else {
                $d["is_payed"] = false;
            }
        }
        return response()->json($data);

    }
    public function CheckAccessToModule(Request $request)
    {
        $request->validate([
            "module_name" => "required|max:255",
        ]);
        $user = $request->attributes->get('user');
        $module = Module::where("module_name", $request->module_name)->with("subscription_plan")->first();
        $subscription_plan = UserSubscriptionplan::where("user_id", $user->id)->where("subscription_plan_id", $module->subscription_plan->id)->first();

        return response()->json(["is_payed" => UserSubscriptionplanService::CheckPaymentDateIfItIsPassed($subscription_plan),
        ]);
    }

        public function checkStatusPaye(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string'
        ]);
        $apiKey = $request->input('api_key');

        if (!$apiKey) {
                return response()->json([
                    'paye' => false,
                    'message' => 'API key is required'
                ], 400);
            }

        $paye = $this->subscriptionService->checkSubscriptionStatus($apiKey);

        return response()->json([
            'paye' => $paye,
        ]);
    }
}
