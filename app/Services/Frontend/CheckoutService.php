<?php

namespace App\Services\Frontend;

use App\Interfaces\OrderRepositoryInterface;
use App\Models\Order;
use App\Services\DemoProductService;
use Illuminate\Http\Request;
use RuntimeException;
use Throwable;

class CheckoutService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly DemoProductService $demoProducts,
    ) {}

    public function cartSummary(Request $request): array
    {
        $cartItems = collect($request->session()->get('cart', []))->values();
        $subtotal = $cartItems->sum(fn (array $item) => $item['price'] * $item['quantity']);
        $shipping = $cartItems->isNotEmpty() ? 60 : 0;

        return [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
        ];
    }

    public function placeOrder(Request $request): Order
    {
        $cartItems = collect($request->session()->get('cart', []))->values();

        if ($cartItems->isEmpty()) {
            throw new RuntimeException('Your cart is empty.', 422);
        }

        if (! $request->user()) {
            throw new RuntimeException('Demo mode: checkout preview is available, but order saving is disabled on Vercel.');
        }

        $subtotal = $cartItems->sum(fn (array $item) => $item['price'] * $item['quantity']);
        $order = $this->orders->createWithItems($request->user(), $request->validated(), $cartItems, $subtotal + 60);

        $request->session()->forget('cart');

        return $order;
    }

    public function ordersFor(Request $request)
    {
        try {
            if ($request->user()) {
                return $this->orders->forUser($request->user());
            }
        } catch (Throwable) {
            //
        }

        return $this->demoProducts->orders();
    }
}
