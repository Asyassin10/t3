<?php

use App\Http\Controllers\ModuleController;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get("/fff", function () {
    return Hash::make("password");
});
Route::middleware("auth")->group(function () {
    Route::get("modules", [ModuleController::class, "listModules"])->name("listModules");
    Route::get("Abonnements", [ModuleController::class, "Abonnements"])->name("Abonnements");
    Route::get("crateCheckout/{plan_id}", [ModuleController::class, "crateCheckout"])->name("crateCheckout");
    Route::get("subscription-ok/{plan_id}", [ModuleController::class, "HandleSubscriptionSuccess"])->name("HandleSubscriptionSuccess");
    Route::get("subscription-not-ok/{plan_id}", [ModuleController::class, "HandleSubscriptionNotSuccess"])->name("HandleSubscriptionNotSuccess");
});
