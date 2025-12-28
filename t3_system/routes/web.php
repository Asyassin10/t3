<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Models\Module;
use App\Models\User;
use App\Models\UserSubscriptionplan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
 */

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('auth/google', [RegisteredUserController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [RegisteredUserController::class, 'handleGoogleCallback']);

require __DIR__ . '/auth.php';
require __DIR__ . '/app_routes.php';

use Illuminate\Support\Str;

Route::get("publish", function () {
    /*  $article = [
        'id' => '123456',
        'name' => 'Using Redis Pub/Sub with Laravel',
        'blog' => 'dddddddddddddddddddddddd Blog Name',
    ]; */
    $pwd = Hash::make(Str::random(20));
    $moduls = UserSubscriptionplan::where("user_id", Auth::id())->with([
        "subscription_plan.modules",
        "user"
    ])->get();
    $modules_data = $moduls->pluck("subscription_plan.modules")->toArray()[0];

    $data_to_create_enviremenet = [
        "email" => "kssdddddddssdddjndflvdfv@gmail.com",
        "name" => "ksddddddsaaassdjndflvdfv",
        "password" => $pwd,
        "modules" => $modules_data,
        "app_api_key" => Str::random(20),
        "user_subscriptionplan_date_start" => "2024-02-05",
        "user_subscriptionplan_date_end" => "2026-02-05",
    ];
    /*    Redis::publish('system-channel', json_encode($data_to_create_enviremenet)); */

    return "ddd";
})->middleware("auth");
/* Route::get("ddddddddddddddddddddd", function () {
    $users = User::all();
    foreach ($users as $user) {
        $pwd = Hash::make("password");
        $user->password = $pwd;
        $user->save();
    }
    return "done.";
});


 */

Route::get("ddddaasasa", function () {
    return Module::all();
});
