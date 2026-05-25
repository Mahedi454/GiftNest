<?php

namespace App\Services\Images;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ImageStorageService
{
    public function storeProductImage(UploadedFile $image): array
    {
        if ($this->cloudinaryEnabled()) {
            return $this->storeOnCloudinary($image);
        }

        return $this->storeLocally($image);
    }

    public function deleteProductImage(?string $filename = null, ?string $publicId = null): void
    {
        if ($publicId && $this->cloudinaryEnabled()) {
            $timestamp = time();
            $params = [
                'public_id' => $publicId,
                'timestamp' => $timestamp,
            ];

            Http::asForm()->post($this->cloudinaryApiUrl('destroy'), [
                ...$params,
                'api_key' => env('CLOUDINARY_API_KEY'),
                'signature' => $this->signature($params),
            ]);

            return;
        }

        if (! $filename || str_starts_with($filename, 'http')) {
            return;
        }

        $imagePath = public_path('images/products/'.$filename);

        if (File::exists($imagePath)) {
            File::delete($imagePath);
        }
    }

    private function cloudinaryEnabled(): bool
    {
        return filled(env('CLOUDINARY_CLOUD_NAME'))
            && filled(env('CLOUDINARY_API_KEY'))
            && filled(env('CLOUDINARY_API_SECRET'));
    }

    private function storeOnCloudinary(UploadedFile $image): array
    {
        $timestamp = time();
        $params = [
            'folder' => env('CLOUDINARY_PRODUCT_FOLDER', 'giftnest/products'),
            'timestamp' => $timestamp,
        ];

        $response = Http::attach(
            'file',
            file_get_contents($image->getRealPath()),
            $image->getClientOriginalName(),
        )->post($this->cloudinaryApiUrl('upload'), [
            ...$params,
            'api_key' => env('CLOUDINARY_API_KEY'),
            'signature' => $this->signature($params),
        ])->throw();

        $result = $response->json();

        return [
            'image' => basename((string) $result['secure_url']),
            'image_url' => (string) $result['secure_url'],
            'image_public_id' => (string) $result['public_id'],
        ];
    }

    private function cloudinaryApiUrl(string $action): string
    {
        return sprintf(
            'https://api.cloudinary.com/v1_1/%s/image/%s',
            env('CLOUDINARY_CLOUD_NAME'),
            $action,
        );
    }

    private function signature(array $params): string
    {
        ksort($params);

        $payload = collect($params)
            ->map(fn ($value, $key) => $key.'='.$value)
            ->implode('&');

        return sha1($payload.env('CLOUDINARY_API_SECRET'));
    }

    private function storeLocally(UploadedFile $image): array
    {
        $filename = Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = $filename.'-'.time().'.'.$image->getClientOriginalExtension();
        $destination = public_path('images/products');

        if (! File::isDirectory($destination)) {
            File::ensureDirectoryExists($destination);
        }

        $image->move($destination, $filename);

        return [
            'image' => $filename,
            'image_url' => null,
            'image_public_id' => null,
        ];
    }
}
