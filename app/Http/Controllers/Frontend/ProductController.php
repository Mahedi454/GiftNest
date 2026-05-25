<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\ProductCatalogService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function __construct(private readonly ProductCatalogService $products) {}

    public function home(): View
    {
        $catalog = $this->products->homeCatalog();

        return view('pages.home', [
            'heroProducts' => $catalog['heroProducts'],
            'featuredProducts' => $catalog['featuredProducts'],
            'categoryCount' => $catalog['categoryCount'],
        ]);
    }

    public function index(Request $request): View
    {
        return view('pages.shop', [
            'products' => $this->products->paginatedActiveProducts($request->only(['search', 'category'])),
        ]);
    }

    public function show(string $product): View
    {
        $details = $this->products->productDetails($product);

        abort_unless($details, 404);

        return view('pages.product', [
            'product' => $details['product'],
            'relatedProducts' => $details['relatedProducts'],
        ]);
    }
}
