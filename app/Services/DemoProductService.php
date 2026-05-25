<?php

namespace App\Services;

use App\Support\DemoRecord;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;

class DemoProductService
{
    public function isVercelDemo(): bool
    {
        return (bool) env('VERCEL')
            || (
                Config::get('database.default') === 'sqlite'
                && str_contains((string) Config::get('database.connections.sqlite.database'), '/tmp/')
            );
    }

    public function products(): Collection
    {
        $categories = $this->categories()->keyBy('name');

        return collect([
            [
                'id' => 101,
                'name' => 'Birthday Explosion Box',
                'slug' => 'birthday-explosion-box',
                'price' => 1350,
                'description' => 'A handcrafted birthday surprise box filled with layers of wishes and sweet memories.',
                'category' => 'Birthday Gifts',
                'image' => 'birthday-explosion-box-1-1775137995.webp',
                'stock' => 15,
            ],
            [
                'id' => 102,
                'name' => 'Love Message Bottle',
                'slug' => 'love-message-bottle',
                'price' => 690,
                'description' => 'A tiny message bottle designed for heartfelt notes and romantic surprises.',
                'category' => 'Romantic Gifts',
                'image' => 'love-message-bottle-2-1775391437.jpg',
                'stock' => 10,
            ],
            [
                'id' => 103,
                'name' => 'LED Eternal Rose Dome',
                'slug' => 'led-eternal-rose-dome',
                'price' => 1790,
                'description' => 'A glowing eternal rose dome that blends floral style with decorative lighting.',
                'category' => 'Romantic Gifts',
                'image' => 'led-eternal-rose-dome-1775391543.webp',
                'stock' => 8,
            ],
            [
                'id' => 104,
                'name' => 'Chocolate Basket',
                'slug' => 'chocolate-basket',
                'price' => 1790,
                'description' => 'A generous chocolate basket demo item for family visits and celebration tables.',
                'category' => 'Food Hampers',
                'image' => 'deluxe-chocolate-gift-basket-1775393419.jpg',
                'stock' => 12,
            ],
            [
                'id' => 105,
                'name' => 'Achievement Trophy',
                'slug' => 'achievement-trophy',
                'price' => 1390,
                'description' => 'A trophy-style achievement gift for graduations, wins, and special milestones.',
                'category' => 'Personalized Gifts',
                'image' => 'achievement-trophy-1775393036.jpg',
                'stock' => 5,
            ],
            [
                'id' => 106,
                'name' => 'Modern Aesthetic Wall Art Frame',
                'slug' => 'modern-aesthetic-wall-art-frame',
                'price' => 1790,
                'description' => 'A modern wall art frame designed for home decor and elegant gifting.',
                'category' => 'Personalized Gifts',
                'image' => 'modern-aesthetic-wall-art-frame-1775393307.webp',
                'stock' => 7,
            ],
        ])->map(function (array $product) use ($categories): DemoRecord {
            $category = $categories->get($product['category']);

            return new DemoRecord([
                ...$product,
                'category_id' => $category?->id,
                'category' => $category,
                'is_active' => true,
            ]);
        });
    }

    public function categories(): Collection
    {
        return collect([
            ['id' => 201, 'name' => 'Birthday Gifts', 'products_count' => 1],
            ['id' => 202, 'name' => 'Romantic Gifts', 'products_count' => 2],
            ['id' => 203, 'name' => 'Food Hampers', 'products_count' => 1],
            ['id' => 204, 'name' => 'Personalized Gifts', 'products_count' => 2],
        ])->map(fn (array $category) => new DemoRecord($category));
    }

    public function findProduct(string|int $key): ?DemoRecord
    {
        return $this->products()->first(
            fn (DemoRecord $product) => (string) $product->id === (string) $key
                || (string) $product->slug === (string) $key
        );
    }

    public function relatedProducts(string|int $except, int $limit = 4): Collection
    {
        return $this->products()
            ->reject(fn (DemoRecord $product) => (string) $product->id === (string) $except || (string) $product->slug === (string) $except)
            ->take($limit)
            ->values();
    }

    public function demoUser(): DemoRecord
    {
        return new DemoRecord([
            'id' => 301,
            'name' => 'GiftNest Demo Admin',
            'email' => 'demo@giftnest.test',
            'phone' => '+8801000000000',
            'address' => 'Vercel preview address',
            'role' => 'admin',
            'created_at' => Carbon::now()->subDays(18),
        ]);
    }

    public function users(): Collection
    {
        return collect([
            $this->demoUser(),
            new DemoRecord([
                'id' => 302,
                'name' => 'Sample Customer',
                'email' => 'customer@giftnest.test',
                'role' => 'user',
                'created_at' => Carbon::now()->subDays(6),
            ]),
        ]);
    }

    public function orders(): Collection
    {
        $items = $this->products()->take(2)->map(fn (DemoRecord $product) => new DemoRecord([
            'product' => $product,
            'quantity' => 1,
            'price' => $product->price,
        ]));

        return collect([
            new DemoRecord([
                'id' => 401,
                'customer_name' => 'Sample Customer',
                'phone' => '+8801777777777',
                'address' => 'Dhaka, Bangladesh',
                'status' => 'pending',
                'total_price' => 2240,
                'created_at' => Carbon::now()->subDays(2),
                'user' => new DemoRecord(['email' => 'customer@giftnest.test']),
                'items' => $items,
            ]),
        ]);
    }

    public function paginate(Collection $items, int $perPage = 12, string $pageName = 'page'): LengthAwarePaginator
    {
        $page = LengthAwarePaginator::resolveCurrentPage($pageName);
        $slice = $items->forPage($page, $perPage)->values();

        return new LengthAwarePaginator($slice, $items->count(), $perPage, $page, [
            'path' => LengthAwarePaginator::resolveCurrentPath(),
            'pageName' => $pageName,
        ]);
    }
}
