<?php $__env->startSection('title', 'GiftNest - Thoughtful Gifts for Every Occasion'); ?>

<?php $__env->startSection('content'); ?>
  <?php
    $heroItems = $heroProducts->take(3)->values();
    $spotlightCount = $heroItems->count() ?: max(1, $featuredProducts->count());
  ?>

  <section class="hero hero--showcase">
    <div class="hero-showcase">
      <div class="hero-showcase__content">
        <div class="hero-showcase__eyebrow">
          <span class="kicker">Modern gifting for Bangladesh</span>
          <span class="chip">Same-day friendly</span>
        </div>

        <h1>Find the right gift with ease.</h1>

        <p class="lead hero-showcase__lead">
          Discover curated picks for birthdays, campus surprises, and everyday celebrations with a smoother shopping experience from first click to checkout.
        </p>

        <div class="hero-showcase__actions">
          <a class="btn" href="<?php echo e(route('shop')); ?>">Shop now</a>
          <a class="btn btn--ghost" href="<?php echo e(route('about')); ?>">Learn more</a>
        </div>

        <div class="hero-showcase__stats">
          <div class="hero-showcase__stat card">
            <div class="hero-showcase__statValue"><?php echo e(count($featuredProducts) + count($heroProducts)); ?>+</div>
            <div class="hero-showcase__statLabel">Featured gift picks</div>
          </div>
          <div class="hero-showcase__stat card">
            <div class="hero-showcase__statValue"><?php echo e($categoryCount); ?></div>
            <div class="hero-showcase__statLabel">Gift categories</div>
          </div>
          <div class="hero-showcase__stat card">
            <div class="hero-showcase__statValue">24h</div>
            <div class="hero-showcase__statLabel">Fast local dispatch</div>
          </div>
        </div>
      </div>

      <div class="hero-showcase__panel card">
        <div class="hero-showcase__panelHead">
          <div class="hero-showcase__panelTitle">
            <span class="hero-showcase__panelKicker">Curated now</span>
            <h2>Today's Picks</h2>
            <p>Selected from your new gift catalog</p>
          </div>
          <span class="chip">Trending</span>
        </div>

        <div class="hero-showcase__promo">
          <div>
            <div class="hero-showcase__promoLabel">This week</div>
            <p>Ready-to-ship gifts selected from the latest collection</p>
          </div>
          <a class="hero-showcase__promoLink" href="<?php echo e(route('shop')); ?>">Explore collection</a>
        </div>

        <?php if($heroItems->isNotEmpty()): ?>
          <div class="hero-showcase__products">
            <?php $__currentLoopData = $heroItems; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <?php
                $productImageUrl = $product->image_url ?? null;
                $productImagePath = ! $productImageUrl && $product->image ? public_path('images/products/' . $product->image) : null;
                $productImageUrl = $productImageUrl ?: ($productImagePath && file_exists($productImagePath)
                  ? asset('images/products/' . $product->image)
                  : '');
              ?>

              <article class="hero-mini card">
                <a class="hero-mini__media" href="<?php echo e(route('product.show', $product)); ?>">
                  <?php if($productImageUrl): ?>
                    <img src="<?php echo e($productImageUrl); ?>" alt="<?php echo e($product->name); ?>" class="hero-mini__image" />
                  <?php else: ?>
                    <div class="hero-mini__placeholder"><?php echo e($product->name); ?></div>
                  <?php endif; ?>
                  <span class="hero-mini__tag">
                    <?php echo e(['Best Seller', 'Elegant', 'Romantic'][$loop->index] ?? 'Gift Pick'); ?>

                  </span>
                </a>

                <div class="hero-mini__body">
                  <div class="hero-mini__meta">
                    <span>Ready to ship</span>
                  </div>

                  <h3 class="hero-mini__title">
                    <a href="<?php echo e(route('product.show', $product)); ?>"><?php echo e($product->name); ?></a>
                  </h3>

                  <div class="hero-mini__price">Tk <?php echo e(number_format((float) $product->price, 0)); ?></div>
                  <p class="hero-mini__text">
                    <?php echo e(\Illuminate\Support\Str::limit($product->description, 52)); ?>

                  </p>

                  <div class="hero-mini__actions">
                    <form method="POST" action="<?php echo e(route('cart.store', $product)); ?>">
                      <?php echo csrf_field(); ?>
                      <button class="btn" type="submit">Add</button>
                    </form>
                  </div>
                </div>
              </article>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </div>
        <?php else: ?>
          <div class="hero-showcase__empty">
            <div class="empty">
              <div class="empty__title">No picks yet</div>
              <div class="empty__subtitle">Add a few products to the catalog to populate this section.</div>
            </div>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </section>

  <section class="section section--tight why-giftnest">
    <div class="section__head">
      <div>
        <div class="kicker">Why GiftNest</div>
        <h2>A simple gifting flow made for quick decisions</h2>
      </div>
    </div>

    <div class="grid grid--3">
      <article class="feature-panel card feature-panel--home">
        <div class="feature-panel__icon">01</div>
        <h3>Browse curated picks</h3>
        <p>Explore a focused collection of gifts for birthdays, campus moments, and everyday surprises without unnecessary clutter.</p>
      </article>

      <article class="feature-panel card feature-panel--home">
        <div class="feature-panel__icon">02</div>
        <h3>Add to cart in seconds</h3>
        <p>Use the simple session-based cart to collect your favorites and adjust quantities quickly before checkout.</p>
      </article>

      <article class="feature-panel card feature-panel--home">
        <div class="feature-panel__icon">03</div>
        <h3>Place a smooth order</h3>
        <p>Complete checkout with basic delivery details and finish the order flow with a clean, beginner-friendly experience.</p>
      </article>
    </div>
  </section>

  <section class="section">
    <div class="section__head">
      <div>
        <div class="kicker">Featured collection</div>
        <h2>Thoughtful picks that look good and ship beautifully</h2>
      </div>
      <a class="link" href="<?php echo e(route('shop')); ?>">View all</a>
    </div>
    <div class="grid grid--4">
      <?php $__currentLoopData = $featuredProducts; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <?php if (isset($component)) { $__componentOriginal3fd2897c1d6a149cdb97b41db9ff827a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3fd2897c1d6a149cdb97b41db9ff827a = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.product-card','data' => ['product' => $product]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('product-card'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['product' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($product)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal3fd2897c1d6a149cdb97b41db9ff827a)): ?>
<?php $attributes = $__attributesOriginal3fd2897c1d6a149cdb97b41db9ff827a; ?>
<?php unset($__attributesOriginal3fd2897c1d6a149cdb97b41db9ff827a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal3fd2897c1d6a149cdb97b41db9ff827a)): ?>
<?php $component = $__componentOriginal3fd2897c1d6a149cdb97b41db9ff827a; ?>
<?php unset($__componentOriginal3fd2897c1d6a149cdb97b41db9ff827a); ?>
<?php endif; ?>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/pages/home.blade.php ENDPATH**/ ?>