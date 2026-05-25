<?php

namespace App\Repositories;

use App\Interfaces\OrderRepositoryInterface;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EloquentOrderRepository implements OrderRepositoryInterface
{
    public function createWithItems(User $user, array $customerData, Collection $cartItems, float $total): Order
    {
        return DB::transaction(function () use ($user, $customerData, $cartItems, $total) {
            $order = Order::create([
                'user_id' => $user->id,
                'customer_name' => $customerData['name'],
                'phone' => $customerData['phone'],
                'address' => $customerData['address'],
                'total_price' => $total,
                'status' => 'pending',
            ]);

            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            return $order;
        });
    }

    public function forUser(User $user): Collection
    {
        return $user->orders()->latest()->get();
    }
}
