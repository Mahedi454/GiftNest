<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\DemoProductService;
use Illuminate\View\View;
use Throwable;

class AdminDashboardController extends Controller
{
    public function __construct(private readonly DemoProductService $demoProducts)
    {
    }

    public function index(): View
    {
        try {
            $totalRevenue = Order::query()
                ->where('status', 'completed')
                ->sum('total_price');

            $stats = [
                'users' => User::query()->count(),
                'products' => Product::query()->count(),
                'orders' => Order::query()->count(),
                'revenue' => $totalRevenue,
            ];
        } catch (Throwable) {
            $stats = [
                'users' => $this->demoProducts->users()->count(),
                'products' => $this->demoProducts->products()->count(),
                'orders' => $this->demoProducts->orders()->count(),
                'revenue' => 0,
            ];
        }

        return view('pages.admin.index', [
            'stats' => $stats,
        ]);
    }
}
