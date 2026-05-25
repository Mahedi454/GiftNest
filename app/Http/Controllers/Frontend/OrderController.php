<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Services\Frontend\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly CheckoutService $checkout) {}

    public function checkout(Request $request): View
    {
        return view('pages.checkout', $this->checkout->cartSummary($request));
    }

    public function store(CheckoutRequest $request): RedirectResponse
    {
        try {
            $order = $this->checkout->placeOrder($request);
        } catch (Throwable $exception) {
            return redirect()
                ->route($exception->getCode() === 422 ? 'cart' : 'checkout')
                ->with('status', $exception->getMessage());
        }

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
        return view('pages.orders', [
            'orders' => $this->checkout->ordersFor($request),
        ]);
    }
}
