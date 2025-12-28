<?php

namespace App\Http\Controllers;

use App\Models\AppClientEnvirenement;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\UserSubscriptionplan;
use App\Notifications\AccountCreationCredential;
use App\Services\UserSubscriptionplanService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class ModuleController extends Controller
{
    //
    public function listModules()
    {
        //return SubscriptionPlan::with("modules")->get();
        $data = SubscriptionPlan::with("modules")->get();
        foreach ($data as $d) {
            $subscription_plan = UserSubscriptionplan::where("user_id", Auth::id())->where("subscription_plan_id", $d->id)->first();
            if ($subscription_plan) {

                $d["is_payed"] = UserSubscriptionplanService::CheckPaymentDateIfItIsPassed($subscription_plan);
            } else {
                $d["is_payed"] = false;
            }
        }
        return view("profile.listModules")->with("subscription_plans", $data);
    }
    public function Abonnements()
    {
        $data = UserSubscriptionplan::where("user_id", Auth::id())->with(["subscription_plan.modules", "user"])->get();
        foreach ($data as $d) {
            $d["is_payed"] = UserSubscriptionplanService::CheckPaymentDateIfItIsPassed($d);
        }
        //return $data;
        return view("profile.Abonnements")->with("data", $data);
    }
    public function crateCheckout($plan_id)
    {
        $user = User::find(Auth::id());
        $plan = SubscriptionPlan::find($plan_id);
        return $user->newSubscription('default', $plan->stripe_id)
            ->trialDays($plan->free_trial_days_count)
            //  ->allowPromotionCodes()
            ->checkout([
                'success_url' => route('HandleSubscriptionSuccess', ["plan_id" => $plan->id]) . "?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => route('HandleSubscriptionNotSuccess', ["plan_id" => $plan->id]) . "?session_id={CHECKOUT_SESSION_ID}",
            ]);
    }
    public function HandleSubscriptionSuccess($plan_id, Request $request)
    {


        $user = User::find(Auth::id());
        $plan = SubscriptionPlan::find($plan_id);
        $currentDateTime = Carbon::now();
        $subscriptionStartDate = Carbon::createFromDate($currentDateTime->year, $currentDateTime->month, $currentDateTime->day)->addYear();

        $subscription = UserSubscriptionplan::create([
            "user_id" => $user->id,
            "subscription_plan_id" => $plan->id,
            "user_subscriptionplan_date_start" => $currentDateTime,
            "user_subscriptionplan_date_end" => $subscriptionStartDate,
        ]);

        // Reload with relations (one query)
        $subscription->load([
            "subscription_plan.modules",
            "user"
        ]);

        // Get modules cleanly
        $modules_data = $subscription->subscription_plan->modules;
        $pwd_str = Str::random(20);
        $data_to_create_enviremenet = [
            "email" => $user->email,
            "name" => $user->name,
            "password" => $pwd_str,
            "modules" => $modules_data,
            "app_api_key" => $user->app_api_key,
            "paye" => true,
            "user_subscriptionplan_date_start" => $currentDateTime,
            "user_subscriptionplan_date_end" => $subscriptionStartDate,
            "user_id" => $user->id,
        ];
        // AppClientEnvirenement::create
        AppClientEnvirenement::create($data_to_create_enviremenet);

        $user->notify(new AccountCreationCredential($pwd_str));


        /*   Redis::publish('system-channel', json_encode($data_to_create_enviremenet)); */


        return redirect()->route('Abonnements')->with('success', __("app.abonnement_success"));
    }
    public function HandleSubscriptionNotSuccess($plan_id)
    {
        $user = User::find(Auth::id());
        // manage it later
        return "payment failled";
    }
}
