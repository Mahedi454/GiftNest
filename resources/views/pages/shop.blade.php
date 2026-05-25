@extends('layouts.app')

@section('title', 'GiftNest - Shop')

@section('content')
  <section class="section section--tight">
    <div class="section__head">
      <div>
        <div class="kicker">Product Listing</div>
        <h1>Shop all products</h1>
      </div>
      <div class="muted">A clean product grid built with Laravel Blade and a reusable product card component.</div>
    </div>
  </section>

  <section class="section">
    <form class="card" method="GET" action="{{ route('shop') }}">
      <div class="grid grid--2">
        <label class="field">
          <span class="field__label">Search</span>
          <input class="input" type="search" name="search" value="{{ request('search') }}" placeholder="Search gifts" />
        </label>

        <label class="field">
          <span class="field__label">Category</span>
          <input class="input" type="text" name="category" value="{{ request('category') }}" placeholder="Birthday Gifts" />
        </label>
      </div>

      <div class="admin-product-form__actions">
        <button class="btn" type="submit">Filter</button>
        <a class="btn btn--ghost" href="{{ route('shop') }}">Reset</a>
      </div>
    </form>

    <div class="grid grid--4">
      @forelse ($products as $product)
        <x-product-card :product="$product" />
      @empty
        <div class="card empty shop-empty">
          <div class="empty__title">No products found</div>
          <div class="empty__subtitle">Create products from the admin panel and they will appear here.</div>
        </div>
      @endforelse
    </div>

    @if ($products->hasPages())
      <div class="pagination">
        @if ($products->onFirstPage())
          <span class="pagination__link pagination__link--disabled">Prev</span>
        @else
          <a class="pagination__link" href="{{ $products->previousPageUrl() }}">Prev</a>
        @endif

        @foreach ($products->getUrlRange(1, $products->lastPage()) as $page => $url)
          <a class="pagination__link {{ $page === $products->currentPage() ? 'pagination__link--active' : '' }}" href="{{ $url }}">
            {{ $page }}
          </a>
        @endforeach

        @if ($products->hasMorePages())
          <a class="pagination__link" href="{{ $products->nextPageUrl() }}">Next</a>
        @else
          <span class="pagination__link pagination__link--disabled">Next</span>
        @endif
      </div>
    @endif
  </section>
@endsection
