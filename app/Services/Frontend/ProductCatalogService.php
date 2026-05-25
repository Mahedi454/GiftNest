<?php

namespace App\Services\Frontend;

use App\Interfaces\CategoryRepositoryInterface;
use App\Interfaces\ProductRepositoryInterface;
use App\Services\DemoProductService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Throwable;

class ProductCatalogService
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
        private readonly CategoryRepositoryInterface $categories,
        private readonly DemoProductService $demoProducts,
    ) {}

    public function homeCatalog(): array
    {
        try {
            $products = $this->products->activeProducts();

            if ($products->isEmpty()) {
                $products = $this->demoProducts->products();
            }

            $categoryCount = $this->categories->count() ?: $this->demoProducts->categories()->count();
        } catch (Throwable) {
            $products = $this->demoProducts->products();
            $categoryCount = $this->demoProducts->categories()->count();
        }

        return [
            'heroProducts' => $products->take(3),
            'featuredProducts' => $products->skip(3)->take(4),
            'categoryCount' => $categoryCount,
        ];
    }

    public function paginatedActiveProducts(array $filters = []): LengthAwarePaginator
    {
        try {
            $products = $this->products->paginatedActiveProducts($filters);

            if ($products->total() > 0) {
                return $products;
            }
        } catch (Throwable) {
            //
        }

        $demoProducts = $this->demoProducts->products()
            ->when($filters['search'] ?? null, fn ($products, string $search) => $products->filter(
                fn ($product) => str_contains(strtolower($product->name), strtolower($search))
                    || str_contains(strtolower($product->description), strtolower($search))
            ))
            ->when($filters['category'] ?? null, fn ($products, string $category) => $products->filter(
                fn ($product) => strtolower($product->category->name ?? '') === strtolower($category)
            ))
            ->values();

        return $this->demoProducts->paginate($demoProducts);
    }

    public function productDetails(string|int $key): ?array
    {
        try {
            $product = $this->products->findActiveByKey($key);

            if ($product) {
                return [
                    'product' => $product,
                    'relatedProducts' => $this->products->relatedProducts($product),
                ];
            }
        } catch (Throwable) {
            //
        }

        $demoProduct = $this->demoProducts->findProduct($key);

        if (! $demoProduct) {
            return null;
        }

        return [
            'product' => $demoProduct,
            'relatedProducts' => $this->demoProducts->relatedProducts($key),
        ];
    }
}
