<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $compiledViewsPath = config('view.compiled');

        if (is_string($compiledViewsPath) && ! is_dir($compiledViewsPath)) {
            @mkdir($compiledViewsPath, 0775, true);
        }

        if ($this->app->runningInConsole()) {
            return;
        }

        if ((bool) env('VERCEL')) {
            return;
        }

        if (! extension_loaded('pdo_pgsql') && config('database.default') === 'pgsql') {
            return;
        }

        try {
            if (! Schema::hasTable('users')) {
                return;
            }

            User::updateOrCreate(
                ['email' => 'admin@giftnest.com'],
                [
                    'name' => 'GiftNest Admin',
                    'password' => Hash::make('password'),
                    'role' => 'admin',
                ],
            );
        } catch (Throwable) {
            return;
        }
    }
}
