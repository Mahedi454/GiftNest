<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\DemoProductService;
use Illuminate\View\View;
use Throwable;

class ProductController extends Controller
{
    public function __construct(private readonly DemoProductService $demoProducts) {}

    public function home(): View
    {
        try {
            $products = Product::query()
                ->where('is_active', true)
                ->latest('id')
                ->get();

            if ($products->isEmpty()) {
                $products = $this->demoProducts->products();
            }

            $categoryCount = Category::query()->count() ?: $this->demoProducts->categories()->count();
        } catch (Throwable) {
            $products = $this->demoProducts->products();
            $categoryCount = $this->demoProducts->categories()->count();
        }

        return view('pages.home', [
            'heroProducts' => $products->take(3),
            'featuredProducts' => $products->skip(3)->take(4),
            'categoryCount' => $categoryCount,
        ]);
    }

    public function index(): View
    {
        try {
            $products = Product::query()
                ->where('is_active', true)
                ->latest('id')
                ->paginate(12);

            if ($products->total() > 0) {
                return view('pages.shop', ['products' => $products]);
            }
        } catch (Throwable) {
            //
        }

        return view('pages.shop', [
            'products' => $this->demoProducts->paginate($this->demoProducts->products()),
        ]);
    }

    public function show(string $product): View
    {
        try {
            $realProduct = Product::query()
                ->where('is_active', true)
                ->whereKey($product)
                ->first();

            if ($realProduct) {
                return view('pages.product', [
                    'product' => $realProduct,
                    'relatedProducts' => Product::query()
                        ->where('is_active', true)
                        ->whereKeyNot($realProduct->id)
                        ->latest('id')
                        ->take(4)
                        ->get(),
                ]);
            }
        } catch (Throwable) {
            //
        }

        $demoProduct = $this->demoProducts->findProduct($product);

        abort_unless($demoProduct, 404);

        return view('pages.product', [
            'product' => $demoProduct,
            'relatedProducts' => $this->demoProducts->relatedProducts($product),
        ]);
    }
}
