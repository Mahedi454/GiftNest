<?php

namespace App\Services\Frontend;

use App\Interfaces\ProductRepositoryInterface;
use App\Services\DemoProductService;
use Illuminate\Http\Request;
use Throwable;

class CartService
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
        private readonly DemoProductService $demoProducts,
    ) {}

    public function summary(Request $request): array
    {
        $cart = collect($request->session()->get('cart', []));
        $subtotal = $cart->sum(fn (array $item) => $item['price'] * $item['quantity']);

        return [
            'cartItems' => $cart->values(),
            'subtotal' => $subtotal,
            'shipping' => $cart->isNotEmpty() ? 60 : 0,
        ];
    }

    public function add(Request $request, string|int $productKey): bool
    {
        $product = $this->findProduct($productKey);

        if (! $product) {
            return false;
        }

        $cart = $request->session()->get('cart', []);
        $cartKey = (string) $product->id;
        $quantity = max(1, (int) $request->input('quantity', 1));

        if (isset($cart[$cartKey])) {
            $cart[$cartKey]['quantity'] += $quantity;
        } else {
            $cart[$cartKey] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'image' => $product->image,
                'image_url' => $product->image_url ?? null,
                'quantity' => $quantity,
                'total' => 0,
            ];
        }

        $cart[$cartKey]['total'] = $cart[$cartKey]['price'] * $cart[$cartKey]['quantity'];
        $request->session()->put('cart', $cart);

        return true;
    }

    public function update(Request $request, string|int $productKey): void
    {
        $cart = $request->session()->get('cart', []);
        $cartKey = (string) $productKey;

        if (! isset($cart[$cartKey])) {
            return;
        }

        $quantity = max(1, (int) $request->input('quantity', 1));
        $cart[$cartKey]['quantity'] = $quantity;
        $cart[$cartKey]['total'] = $cart[$cartKey]['price'] * $quantity;
        $request->session()->put('cart', $cart);
    }

    public function remove(Request $request, string|int $productKey): void
    {
        $cart = $request->session()->get('cart', []);
        unset($cart[(string) $productKey]);
        $request->session()->put('cart', $cart);
    }

    private function findProduct(string|int $key): ?object
    {
        try {
            $product = $this->products->findActiveByKey($key);

            if ($product) {
                return $product;
            }
        } catch (Throwable) {
            //
        }

        return $this->demoProducts->findProduct($key);
    }
}
