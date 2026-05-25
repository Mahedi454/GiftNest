<?php

namespace App\Repositories;

use App\Interfaces\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Support\Collection;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    public function count(): int
    {
        return Category::query()->count();
    }

    public function ordered(): Collection
    {
        return Category::query()->orderBy('name')->get();
    }
}
