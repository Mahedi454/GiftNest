<?php

namespace App\Support;

use Illuminate\Contracts\Routing\UrlRoutable;
use Illuminate\Support\Fluent;

class DemoRecord extends Fluent implements UrlRoutable
{
    public function getRouteKey(): mixed
    {
        return $this->slug ?? $this->id;
    }

    public function getRouteKeyName(): string
    {
        return isset($this->slug) ? 'slug' : 'id';
    }

    public function resolveRouteBinding($value, $field = null): static
    {
        return $this;
    }

    public function resolveChildRouteBinding($childType, $value, $field): static
    {
        return $this;
    }
}
