<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\DemoProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly DemoProductService $demoProducts)
    {
    }

    public function index(): View
    {
        try {
            return view('admin.orders.index', [
                'orders' => Order::query()
                    ->with(['user', 'items.product'])
                    ->latest()
                    ->paginate(12),
                'orderStats' => [
                    'total' => Order::query()->count(),
                    'pending' => Order::query()->where('status', 'pending')->count(),
                    'completed' => Order::query()->where('status', 'completed')->count(),
                    'revenue' => Order::query()->where('status', 'completed')->sum('total_price'),
                ],
            ]);
        } catch (Throwable) {
            $orders = $this->demoProducts->orders();

            return view('admin.orders.index', [
                'orders' => $this->demoProducts->paginate($orders),
                'orderStats' => [
                    'total' => $orders->count(),
                    'pending' => $orders->where('status', 'pending')->count(),
                    'completed' => $orders->where('status', 'completed')->count(),
                    'revenue' => $orders->where('status', 'completed')->sum('total_price'),
                ],
            ])->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }
    }

    public function updateStatus(Request $request, string $order): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $order = Order::query()->findOrFail($order);

        $data = $request->validate([
            'status' => ['required', 'in:pending,completed'],
        ]);

        $order->update($data);

        return back()->with('status', 'Order status updated successfully.');
    }
}
