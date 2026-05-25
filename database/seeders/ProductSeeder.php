<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Birthday Explosion Box', 'category' => 'Birthday Gifts', 'price' => 1350, 'image' => 'birthday-explosion-box-1-1775137995.webp', 'description' => 'A handcrafted birthday surprise box filled with layers of wishes and sweet memories.', 'stock' => 16, 'is_active' => true],
            ['name' => 'Birthday Explosion Box Deluxe', 'category' => 'Birthday Gifts', 'price' => 1490, 'image' => 'birthday-explosion-box-3-1775391298.jpg', 'description' => 'A deluxe explosion box styled for birthdays, proposals, and personal keepsakes.', 'stock' => 12, 'is_active' => true],
            ['name' => 'Custom Birthday Mug', 'category' => 'Birthday Gifts', 'price' => 490, 'image' => 'custom-birthday-mug-1-1775137710.jpg', 'description' => 'A personalized birthday mug with custom name or message for everyday smiles.', 'stock' => 35, 'is_active' => true],
            ['name' => 'Custom Birthday Mug Classic', 'category' => 'Birthday Gifts', 'price' => 520, 'image' => 'custom-birthday-mug-2-1775391193.jpg', 'description' => 'A classic personalized mug layout for birthday wishes and everyday gifting.', 'stock' => 28, 'is_active' => true],
            ['name' => 'LED Birthday Name Lamp', 'category' => 'Birthday Gifts', 'price' => 1250, 'image' => 'led-birthday-name-lamp-1-1775137577.webp', 'description' => 'A glowing acrylic lamp customized with a birthday name for a warm decorative touch.', 'stock' => 14, 'is_active' => true],
            ['name' => 'LED Birthday Name Lamp Premium', 'category' => 'Birthday Gifts', 'price' => 1350, 'image' => 'led-birthday-name-lamp-2-1775391126.webp', 'description' => 'A premium LED name lamp with a warm glow for personalized birthday decor.', 'stock' => 10, 'is_active' => true],
            ['name' => 'Personalized Birthday Photo Frame', 'category' => 'Birthday Gifts', 'price' => 990, 'image' => 'personalized-birthday-photo-frame-1775137597.webp', 'description' => 'A custom birthday photo frame that turns favorite moments into a keepsake gift.', 'stock' => 20, 'is_active' => true],
            ['name' => 'Personalized Birthday Photo Frame Classic', 'category' => 'Birthday Gifts', 'price' => 1090, 'image' => 'personalized-birthday-photo-frame-1775391082.webp', 'description' => 'A classic birthday photo frame for preserving one favorite celebration moment.', 'stock' => 18, 'is_active' => true],
            ['name' => 'Couple Name Engraved Bracelet', 'category' => 'Jewelry', 'price' => 990, 'image' => 'couple-name-engraved-bracelet-2-1775391388.webp', 'description' => 'A personalized couple bracelet with engraved names for romantic gifting.', 'stock' => 20, 'is_active' => true],
            ['name' => 'LED Eternal Rose Dome', 'category' => 'Flowers', 'price' => 1790, 'image' => 'led-eternal-rose-dome-1775391543.webp', 'description' => 'A glowing eternal rose dome that blends floral style with decorative lighting.', 'stock' => 9, 'is_active' => true],
            ['name' => 'Love Message Bottle', 'category' => 'Personalized Gifts', 'price' => 690, 'image' => 'love-message-bottle-2-1775391437.jpg', 'description' => 'A tiny message bottle designed for heartfelt notes and romantic surprises.', 'stock' => 24, 'is_active' => true],
            ['name' => 'Love Candle Gift', 'category' => 'Personalized Gifts', 'price' => 850, 'image' => 'love-candle-2-1775393357.webp', 'description' => 'A decorative candle gift with a soft romantic mood for cozy celebrations.', 'stock' => 17, 'is_active' => true],
            ['name' => 'Deluxe Chocolate Gift Basket', 'category' => 'Gift Hampers', 'price' => 2190, 'image' => 'deluxe-chocolate-gift-basket-1775393419.jpg', 'description' => 'A full chocolate basket packed for birthdays, visits, and festive sharing.', 'stock' => 11, 'is_active' => true],
            ['name' => 'Celebration Cake Box', 'category' => 'Gift Boxes', 'price' => 1590, 'image' => 'celebration-cake-box-1775393485.jpg', 'description' => 'A celebration cake box arranged for memorable birthdays and small parties.', 'stock' => 12, 'is_active' => true],
            ['name' => 'Brain Teaser Puzzle Gift Box', 'category' => 'Gift Boxes', 'price' => 1190, 'image' => 'brain-teaser-puzzle-gift-box-1775393557.jpg', 'description' => 'A puzzle-themed gift box for playful minds and creative celebrations.', 'stock' => 15, 'is_active' => true],
            ['name' => 'Cartoon Printed Kids Bottle', 'category' => 'Personalized Gifts', 'price' => 640, 'image' => 'cartoon-printed-kids-bottle-1775393182.jpg', 'description' => 'A cheerful printed bottle for kids, school days, and practical gifting.', 'stock' => 22, 'is_active' => true],
            ['name' => 'Custom Baby Name Cushion', 'category' => 'Personalized Gifts', 'price' => 890, 'image' => 'custom-baby-name-cushion-1775393115.jpg', 'description' => 'A soft baby name cushion made for nursery decor and thoughtful family gifts.', 'stock' => 14, 'is_active' => true],
            ['name' => 'Personalized Family Name Wall Sign', 'category' => 'Personalized Gifts', 'price' => 1490, 'image' => 'personalized-family-name-wall-sign-1775392710.jpg', 'description' => 'A customized family name wall sign for home decor and housewarming gifts.', 'stock' => 10, 'is_active' => true],
            ['name' => 'Family Heritage Photo Frame', 'category' => 'Personalized Gifts', 'price' => 1590, 'image' => 'family-heritage-photo-frame-2-1775392616.avif', 'description' => 'A heritage-inspired photo frame for family memories and meaningful displays.', 'stock' => 8, 'is_active' => true],
            ['name' => 'Artistic Family Canvas', 'category' => 'Personalized Gifts', 'price' => 1890, 'image' => 'artistic-family-canvas-1775392876.avif', 'description' => 'An artistic canvas print for family portraits, wall art, and keepsake gifting.', 'stock' => 9, 'is_active' => true],
            ['name' => 'Handmade Memory Scrapbook', 'category' => 'Gift Boxes', 'price' => 1290, 'image' => 'handmade-memory-scrapbook-1775392787.webp', 'description' => 'A handmade scrapbook for collecting photos, notes, and celebration memories.', 'stock' => 13, 'is_active' => true],
            ['name' => 'Graduation Surprise Memory Box', 'category' => 'Gift Boxes', 'price' => 1690, 'image' => 'graduation-surprise-memory-box-1775392955.avif', 'description' => 'A graduation-themed memory box for achievements, photos, and small keepsakes.', 'stock' => 7, 'is_active' => true],
            ['name' => 'Achievement Trophy', 'category' => 'Personalized Gifts', 'price' => 1390, 'image' => 'achievement-trophy-1775393036.jpg', 'description' => 'A trophy-style achievement gift for graduations, wins, and special milestones.', 'stock' => 10, 'is_active' => true],
            ['name' => 'Modern Aesthetic Wall Art Frame', 'category' => 'Personalized Gifts', 'price' => 1790, 'image' => 'modern-aesthetic-wall-art-frame-1775393307.webp', 'description' => 'A modern wall art frame designed for home decor and elegant gifting.', 'stock' => 12, 'is_active' => true],
        ];

        $availableImages = collect(File::files(public_path('images/products')))
            ->map(fn ($file) => $file->getFilename())
            ->all();

        Product::query()
            ->whereNotNull('image')
            ->whereNotIn('image', $availableImages)
            ->delete();

        foreach ($products as $product) {
            if (! in_array($product['image'], $availableImages, true)) {
                continue;
            }

            $category = Category::where('name', $product['category'])->firstOrFail();

            Product::updateOrCreate(
                ['image' => $product['image']],
                [
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'description' => $product['description'],
                    'image' => $product['image'],
                    'category_id' => $category->id,
                    'stock' => $product['stock'],
                    'is_active' => $product['is_active'],
                ],
            );
        }
    }
}
