<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\DemoProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Throwable;

class CategoryController extends Controller
{
    public function __construct(private readonly DemoProductService $demoProducts)
    {
    }

    public function index(): View
    {
        try {
            return view('admin.categories.index', [
                'categories' => Category::query()
                    ->withCount('products')
                    ->orderBy('name')
                    ->paginate(8),
                'categoryStats' => [
                    'total' => Category::query()->count(),
                    'with_products' => Category::query()->has('products')->count(),
                    'empty' => Category::query()->doesntHave('products')->count(),
                ],
            ]);
        } catch (Throwable) {
            $categories = $this->demoProducts->categories();

            return view('admin.categories.index', [
                'categories' => $this->demoProducts->paginate($categories, 8),
                'categoryStats' => [
                    'total' => $categories->count(),
                    'with_products' => $categories->where('products_count', '>', 0)->count(),
                    'empty' => $categories->where('products_count', 0)->count(),
                ],
            ])->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        Category::create($request->validated());

        return back()->with('status', 'Category created successfully.');
    }

    public function update(UpdateCategoryRequest $request, string $category): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $category = Category::query()->findOrFail($category);

        $category->update($request->validated());

        return back()->with('status', 'Category updated successfully.');
    }

    public function destroy(string $category): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $category = Category::query()->findOrFail($category);

        if ($category->products()->exists()) {
            return back()->with('status', 'Delete or move products from this category first.');
        }

        $category->delete();

        return back()->with('status', 'Category deleted successfully.');
    }
}
