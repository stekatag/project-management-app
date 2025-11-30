<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public function register(): void {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
        Vite::prefetch(concurrency: 3);

        // Force HTTPS URLs when behind a proxy in production
        // This ensures all asset URLs use HTTPS instead of HTTP
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
