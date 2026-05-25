<?php $__env->startSection('title', 'GiftNest - Shop'); ?>

<?php $__env->startSection('content'); ?>
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
    <form class="card" method="GET" action="<?php echo e(route('shop')); ?>">
      <div class="grid grid--2">
        <label class="field">
          <span class="field__label">Search</span>
          <input class="input" type="search" name="search" value="<?php echo e(request('search')); ?>" placeholder="Search gifts" />
        </label>

        <label class="field">
          <span class="field__label">Category</span>
          <input class="input" type="text" name="category" value="<?php echo e(request('category')); ?>" placeholder="Birthday Gifts" />
        </label>
      </div>

      <div class="admin-product-form__actions">
        <button class="btn" type="submit">Filter</button>
        <a class="btn btn--ghost" href="<?php echo e(route('shop')); ?>">Reset</a>
      </div>
    </form>

    <div class="grid grid--4">
      <?php $__empty_1 = true; $__currentLoopData = $products; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
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
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
        <div class="card empty shop-empty">
          <div class="empty__title">No products found</div>
          <div class="empty__subtitle">Create products from the admin panel and they will appear here.</div>
        </div>
      <?php endif; ?>
    </div>

    <?php if($products->hasPages()): ?>
      <div class="pagination">
        <?php if($products->onFirstPage()): ?>
          <span class="pagination__link pagination__link--disabled">Prev</span>
        <?php else: ?>
          <a class="pagination__link" href="<?php echo e($products->previousPageUrl()); ?>">Prev</a>
        <?php endif; ?>

        <?php $__currentLoopData = $products->getUrlRange(1, $products->lastPage()); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $page => $url): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <a class="pagination__link <?php echo e($page === $products->currentPage() ? 'pagination__link--active' : ''); ?>" href="<?php echo e($url); ?>">
            <?php echo e($page); ?>

          </a>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

        <?php if($products->hasMorePages()): ?>
          <a class="pagination__link" href="<?php echo e($products->nextPageUrl()); ?>">Next</a>
        <?php else: ?>
          <span class="pagination__link pagination__link--disabled">Next</span>
        <?php endif; ?>
      </div>
    <?php endif; ?>
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/pages/shop.blade.php ENDPATH**/ ?>