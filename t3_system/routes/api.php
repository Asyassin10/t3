<?php

use App\Http\Controllers\Api\ClientEsoftController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
 */

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('apikey')->group(function () {
    Route::get('/user_app', function (Request $request) {
        // Access the user from the request
        $user = $request->attributes->get('user');
        return response()->json($user);
    });

    // Add other routes that require API key authentication
    Route::get("getAbonnements", [ClientEsoftController::class, "getAbonnements"])->name("getAbonnements");
    Route::get("getModules", [ClientEsoftController::class, "getModules"])->name("getModules");
    Route::post("CheckAccessToModule", [ClientEsoftController::class, "CheckAccessToModule"])->name("CheckAccessToModule");
});
Route::post("StatusPaye", [ClientEsoftController::class, "checkStatusPaye"])->name("checkStatusPaye");

