<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cart) {}

    public function index(Request $request): View
    {
        return view('pages.cart', $this->cart->summary($request));
    }

    public function store(Request $request, string $product): RedirectResponse
    {
        if (! $this->cart->add($request, $product)) {
            return redirect()
                ->route('shop')
                ->with('status', 'Demo mode: this product is not available.');
        }

        return redirect()
            ->back()
            ->with('status', 'Product added to cart.');
    }

    public function update(Request $request, string $product): RedirectResponse
    {
        $this->cart->update($request, $product);

        return redirect()
            ->route('cart')
            ->with('status', 'Cart updated successfully.');
    }

    public function destroy(Request $request, string $product): RedirectResponse
    {
        $this->cart->remove($request, $product);

        return redirect()
            ->route('cart')
            ->with('status', 'Item removed from cart.');
    }
}
