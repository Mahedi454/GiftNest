<?php

namespace App\Interfaces;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ProductRepositoryInterface
{
    public function activeProducts(): Collection;

    public function paginatedActiveProducts(array $filters = [], int $perPage = 12): LengthAwarePaginator;

    public function findActiveByKey(string|int $key): ?Product;

    public function relatedProducts(Product $product, int $limit = 4): Collection;
}
