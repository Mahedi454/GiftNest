<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\DemoProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly DemoProductService $demoProducts) {}

    public function checkout(Request $request): View
    {
        $cartItems = collect($request->session()->get('cart', []))->values();
        $subtotal = $cartItems->sum(fn (array $item) => $item['price'] * $item['quantity']);
        $shipping = $cartItems->isNotEmpty() ? 60 : 0;

        return view('pages.checkout', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $cartItems = collect($request->session()->get('cart', []))->values();

        if ($cartItems->isEmpty()) {
            return redirect()
                ->route('cart')
                ->with('status', 'Your cart is empty.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string'],
        ]);

        $subtotal = $cartItems->sum(fn (array $item) => $item['price'] * $item['quantity']);
        $shipping = 60;
        $total = $subtotal + $shipping;

        try {
            if (! $request->user()) {
                throw new \RuntimeException('No authenticated user is available for order storage.');
            }

            $order = DB::transaction(function () use ($request, $data, $cartItems, $total) {
                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'customer_name' => $data['name'],
                    'phone' => $data['phone'],
                    'address' => $data['address'],
                    'total_price' => $total,
                    'status' => 'pending',
                ]);

                foreach ($cartItems as $item) {
                    $order->items()->create([
                        'product_id' => $item['id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }

                return $order;
            });
        } catch (Throwable) {
            return redirect()
                ->route('checkout')
                ->with('status', 'Demo mode: checkout preview is available, but order saving is disabled on Vercel.');
        }

        $request->session()->forget('cart');

        return redirect()
            ->route('checkout.success', $order)
            ->with('status', 'Order placed successfully.');
    }

    public function success(Order $order): View
    {
        abort_unless($order->user_id === auth()->id(), 403);

        return view('pages.checkout-success', [
            'order' => $order->load('items.product'),
        ]);
    }

    public function index(Request $request): View
    {
        try {
            if ($request->user()) {
                return view('pages.orders', [
                    'orders' => $request->user()
                        ->orders()
                        ->latest()
                        ->get(),
                ]);
            }
        } catch (Throwable) {
            //
        }

        return view('pages.orders', [
            'orders' => $this->demoProducts->orders(),
        ]);
    }
}
