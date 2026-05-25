<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\DemoProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Throwable;

class ProductManagementController extends Controller
{
    public function __construct(private readonly DemoProductService $demoProducts)
    {
    }

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

    public function store(Request $request): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()
                ->withInput()
                ->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $data = $this->validatedData($request);

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

    public function update(Request $request, string $product): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()
                ->withInput()
                ->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $product = Product::query()->findOrFail($product);
        $data = $this->validatedData($request, $product);

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
        $product->delete();

        return redirect()
            ->route('admin.products')
            ->with('status', 'Product deleted successfully.');
    }

    private function validatedData(Request $request, ?Product $product = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'string', 'max:255'],
            'image_upload' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif,avif', 'max:4096'],
            'remove_image' => ['nullable', 'boolean'],
            'description' => ['required', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active');
        $removeImage = $request->boolean('remove_image');
        $existingImage = $product?->image;

        if ($request->hasFile('image_upload')) {
            $image = $request->file('image_upload');
            $filename = Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME));
            $filename = $filename.'-'.time().'.'.$image->getClientOriginalExtension();
            $destination = public_path('images/products');

            if (! File::isDirectory($destination)) {
                File::ensureDirectoryExists($destination);
            }

            $image->move($destination, $filename);
            $data['image'] = $filename;

            if ($existingImage && $existingImage !== $filename) {
                $this->deleteImageFile($existingImage);
            }
        } elseif ($removeImage || blank($data['image'])) {
            if ($existingImage) {
                $this->deleteImageFile($existingImage);
            }

            $data['image'] = null;
        }

        unset($data['image_upload'], $data['remove_image']);

        return $data;
    }

    private function deleteImageFile(string $filename): void
    {
        $imagePath = public_path('images/products/'.$filename);

        if (File::exists($imagePath)) {
            File::delete($imagePath);
        }
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

