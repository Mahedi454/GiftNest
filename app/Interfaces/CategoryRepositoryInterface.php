<?php

namespace App\Interfaces;

use Illuminate\Support\Collection;

interface CategoryRepositoryInterface
{
    public function count(): int;

    public function ordered(): Collection;
}
