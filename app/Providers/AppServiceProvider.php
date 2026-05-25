<?php

namespace App\Providers;

use App\Interfaces\CategoryRepositoryInterface;
use App\Interfaces\OrderRepositoryInterface;
use App\Interfaces\ProductRepositoryInterface;
use App\Models\User;
use App\Repositories\EloquentCategoryRepository;
use App\Repositories\EloquentOrderRepository;
use App\Repositories\EloquentProductRepository;
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
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, EloquentCategoryRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, EloquentOrderRepository::class);

        if ((bool) env('VERCEL')) {
            config([
                'cache.default' => env('CACHE_STORE', 'array'),
                'database.default' => env('DB_CONNECTION', 'sqlite'),
                'database.connections.sqlite.database' => env('DB_DATABASE', '/tmp/database.sqlite'),
                'logging.default' => env('LOG_CHANNEL', 'stderr'),
                'session.driver' => env('SESSION_DRIVER', 'cookie'),
                'view.compiled' => env('VIEW_COMPILED_PATH', '/tmp/views'),
            ]);
        }
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
