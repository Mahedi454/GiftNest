<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'description' => $this->description,
            'image' => $this->image_url ?: ($this->image ? asset('images/products/'.$this->image) : null),
            'category' => $this->whenLoaded('category'),
            'stock' => $this->stock,
            'is_active' => $this->is_active,
        ];
    }
}
