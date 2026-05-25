<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\DemoProductService;
use App\Services\Images\ImageStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;
use Throwable;

class ProductManagementController extends Controller
{
    public function __construct(
        private readonly DemoProductService $demoProducts,
        private readonly ImageStorageService $images,
    ) {}

    public function index(): View
    {
        try {
            $productQuery = Product::query()->with('category')->latest();

            return view('admin.products.index', [
                'products' => $productQuery->paginate(12),
                'productStats' => [
                    'total' => Product::query()->count(),
                    'active' => Product::query()->where('is_active', true)->count(),
                    'categories' => Category::query()->count(),
                    'low_stock' => Product::query()->where('stock', '<=', 5)->count(),
                ],
            ]);
        } catch (Throwable) {
            $products = $this->demoProducts->products();

            return view('admin.products.index', [
                'products' => $this->demoProducts->paginate($products),
                'productStats' => [
                    'total' => $products->count(),
                    'active' => $products->where('is_active', true)->count(),
                    'categories' => $this->demoProducts->categories()->count(),
                    'low_stock' => $products->where('stock', '<=', 5)->count(),
                ],
            ])->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }
    }

    public function create(): View
    {
        try {
            $categories = Category::query()->orderBy('name')->get();
        } catch (Throwable) {
            $categories = $this->demoProducts->categories();
        }

        return view('admin.products.create', [
            'product' => new Product([
                'is_active' => true,
                'stock' => 0,
            ]),
            'categories' => $categories,
            'formAction' => route('admin.products.store'),
            'formMethod' => 'POST',
            'pageTitle' => 'Add Product',
            'submitLabel' => 'Create product',
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()
                ->withInput()
                ->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $data = $this->validatedData($request->validated(), $request);

        try {
            DB::transaction(function () use ($data): void {
                Product::create($data);
            });
        } catch (Throwable $exception) {
            Log::error('Failed to create product.', [
                'message' => $exception->getMessage(),
            ]);

            return back()
                ->withInput()
                ->withErrors([
                    'product' => 'The product could not be created. Please check the image, category, and required fields, then try again.',
                ]);
        }

        return redirect()
            ->route('admin.products')
            ->with('status', 'Product added successfully.');
    }

    public function edit(string $product): View
    {
        $product = $this->findProductForAdmin($product);

        try {
            $categories = Category::query()->orderBy('name')->get();
        } catch (Throwable) {
            $categories = $this->demoProducts->categories();
        }

        return view('admin.products.edit', [
            'product' => $product,
            'categories' => $categories,
            'formAction' => route('admin.products.update', $product),
            'formMethod' => 'PUT',
            'pageTitle' => 'Edit Product',
            'submitLabel' => 'Save changes',
        ]);
    }

    public function update(UpdateProductRequest $request, string $product): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()
                ->withInput()
                ->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $product = Product::query()->findOrFail($product);
        $data = $this->validatedData($request->validated(), $request, $product);

        try {
            DB::transaction(function () use ($data, $product): void {
                $product->update($data);
            });
        } catch (Throwable $exception) {
            Log::error('Failed to update product.', [
                'product_id' => $product->id,
                'message' => $exception->getMessage(),
            ]);

            return back()
                ->withInput()
                ->withErrors([
                    'product' => 'The product could not be updated. Please review the form and try again.',
                ]);
        }

        return redirect()
            ->route('admin.products')
            ->with('status', 'Product updated successfully.');
    }

    public function destroy(string $product): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $product = Product::query()->findOrFail($product);
        $this->images->deleteProductImage($product->image, $product->image_public_id);
        $product->delete();

        return redirect()
            ->route('admin.products')
            ->with('status', 'Product deleted successfully.');
    }

    private function validatedData(array $data, StoreProductRequest|UpdateProductRequest $request, ?Product $product = null): array
    {
        $data['is_active'] = $request->boolean('is_active');
        $removeImage = $request->boolean('remove_image');
        $existingImage = $product?->image;
        $existingPublicId = $product?->image_public_id;

        if ($request->hasFile('image_upload')) {
            $storedImage = $this->images->storeProductImage($request->file('image_upload'));
            $data = [...$data, ...$storedImage];

            if ($existingImage || $existingPublicId) {
                $this->images->deleteProductImage($existingImage, $existingPublicId);
            }
        } elseif ($removeImage || blank($data['image'] ?? null)) {
            if ($existingImage || $existingPublicId) {
                $this->images->deleteProductImage($existingImage, $existingPublicId);
            }

            $data['image'] = null;
            $data['image_url'] = null;
            $data['image_public_id'] = null;
        }

        unset($data['image_upload'], $data['remove_image']);

        return $data;
    }

    private function findProductForAdmin(string $product): object
    {
        try {
            $realProduct = Product::query()->find($product);

            if ($realProduct) {
                return $realProduct;
            }
        } catch (Throwable) {
            //
        }

        $demoProduct = $this->demoProducts->findProduct($product);

        abort_unless($demoProduct, 404);

        return $demoProduct;
    }
}

