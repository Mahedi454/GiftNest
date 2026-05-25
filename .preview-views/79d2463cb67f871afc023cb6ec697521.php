<?php $__env->startSection('title', $product->name . ' - GiftNest'); ?>

<?php $__env->startSection('content'); ?>
  <section class="product">
    <div class="product__grid">
      <div class="card product__media">
        <div class="product__mediaFrame">
          <?php
            $imageUrl = $product->image_url ?? null;
            $imagePath = ! $imageUrl && $product->image ? public_path('images/products/' . $product->image) : null;
            $imageUrl = $imageUrl ?: ($imagePath && file_exists($imagePath)
              ? asset('images/products/' . $product->image)
              : '');
          ?>

          <?php if($imageUrl): ?>
            <img src="<?php echo e($imageUrl); ?>" alt="<?php echo e($product->name); ?>" class="product__mediaImage" />
          <?php else: ?>
            <div class="product__mediaPlaceholder">
              <div class="product__mediaBadge">GiftNest</div>
              <span><?php echo e($product->name); ?></span>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <div class="product__info">
        <div class="kicker">Product Details</div>
        <h1><?php echo e($product->name); ?></h1>
        <p class="lead"><?php echo e($product->description); ?></p>

        <div class="product__highlights">
          <span class="chip">Product #<?php echo e($product->id); ?></span>
          <span class="chip">Laravel Blade</span>
          <span class="chip">Responsive Design</span>
        </div>

        <div class="product__buy card">
          <div class="product__buyRow">
            <div>
              <div class="muted">Price</div>
              <div class="price price--xl">Tk <?php echo e(number_format((float) $product->price, 2)); ?></div>
            </div>
          </div>

          <div class="product__actions">
            <form method="POST" action="<?php echo e(route('cart.store', $product)); ?>">
              <?php echo csrf_field(); ?>
              <button class="btn" type="submit">Add to cart</button>
            </form>
            <a class="btn btn--ghost" href="<?php echo e(route('shop')); ?>">Back to shop</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <?php if($relatedProducts->isNotEmpty()): ?>
    <section class="section">
      <div class="section__head">
        <div>
          <div class="kicker">More Products</div>
          <h2>You may also like</h2>
        </div>
      </div>

      <div class="grid grid--4">
        <?php $__currentLoopData = $relatedProducts; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $relatedProduct): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <?php if (isset($component)) { $__componentOriginal3fd2897c1d6a149cdb97b41db9ff827a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3fd2897c1d6a149cdb97b41db9ff827a = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.product-card','data' => ['product' => $relatedProduct]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('product-card'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['product' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($relatedProduct)]); ?>
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
  <?php endif; ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/pages/product.blade.php ENDPATH**/ ?>