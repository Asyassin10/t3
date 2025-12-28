<?php

namespace App\Providers;

use App\Services\AccountService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->singleton(AccountService::class, function ($app) {
            return new AccountService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Schema::defaultStringLength(191); //Update defaultStringLength

    }
}
