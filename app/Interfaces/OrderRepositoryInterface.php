<?php

namespace App\Interfaces;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Collection;

interface OrderRepositoryInterface
{
    public function createWithItems(User $user, array $customerData, Collection $cartItems, float $total): Order;

    public function forUser(User $user): Collection;
}
