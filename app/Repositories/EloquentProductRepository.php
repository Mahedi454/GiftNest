<?php

namespace App\Repositories;

use App\Interfaces\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function activeProducts(): Collection
    {
        return Product::query()
            ->where('is_active', true)
            ->latest('id')
            ->get();
    }

    public function paginatedActiveProducts(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return Product::query()
            ->with('category')
            ->where('is_active', true)
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', '%'.$search.'%')
                        ->orWhere('description', 'like', '%'.$search.'%');
                });
            })
            ->when($filters['category'] ?? null, function ($query, string $category): void {
                $query->whereHas('category', fn ($query) => $query->where('name', $category));
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findActiveByKey(string|int $key): ?Product
    {
        return Product::query()
            ->where('is_active', true)
            ->whereKey($key)
            ->first();
    }

    public function relatedProducts(Product $product, int $limit = 4): Collection
    {
        return Product::query()
            ->where('is_active', true)
            ->whereKeyNot($product->id)
            ->latest('id')
            ->take($limit)
            ->get();
    }
}
