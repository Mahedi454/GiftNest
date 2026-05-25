<?php $__env->startSection('title', 'Admin - Products'); ?>

<?php $__env->startSection('content'); ?>
  <section class="section">
    <div class="section__head">
      <div>
        <h1>Manage products</h1>
        <div class="muted">Live catalog management for products, stock, categories, and storefront visibility.</div>
      </div>
      <a class="btn" href="<?php echo e(route('admin.products.create')); ?>">Add product</a>
    </div>

    <?php if(session('status')): ?>
      <div class="card admin-feedback"><?php echo e(session('status')); ?></div>
    <?php endif; ?>

    <div class="grid grid--4">
      <article class="card kpi">
        <div class="kpi__label">Products</div>
        <div class="kpi__value"><?php echo e($productStats['total']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Active</div>
        <div class="kpi__value"><?php echo e($productStats['active']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Categories</div>
        <div class="kpi__value"><?php echo e($productStats['categories']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Low stock</div>
        <div class="kpi__value"><?php echo e($productStats['low_stock']); ?></div>
      </article>
    </div>
  </section>

  <section class="section section--tight">
    <div class="card table">
      <div class="table__row table__head table__row--products">
        <div>Product</div>
        <div>Category</div>
        <div>Stock</div>
        <div>Price</div>
        <div>Status</div>
        <div>Actions</div>
      </div>

      <?php $__empty_1 = true; $__currentLoopData = $products; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
        <div class="table__row table__row--products">
          <div>
            <div class="admin-listing">
              <div class="admin-listing__thumb">
                <?php if(($product->image_url ?? null) || $product->image): ?>
                  <img src="<?php echo e(($product->image_url ?? null) ?: asset('images/products/' . $product->image)); ?>" alt="<?php echo e($product->name); ?>" />
                <?php else: ?>
                  <div class="admin-listing__placeholder"><?php echo e(strtoupper(substr($product->name, 0, 1))); ?></div>
                <?php endif; ?>
              </div>
              <div class="admin-listing__content">
                <strong><?php echo e($product->name); ?></strong>
                <div class="muted small"><?php echo e(\Illuminate\Support\Str::limit($product->description, 56)); ?></div>
              </div>
            </div>
          </div>
          <div><?php echo e($product->category?->name ?? 'No category'); ?></div>
          <div><?php echo e($product->stock); ?></div>
          <div>Tk <?php echo e(number_format((float) $product->price, 2)); ?></div>
          <div>
            <span class="status <?php echo e($product->is_active ? 'status--delivered' : 'status--pending'); ?>">
              <?php echo e($product->is_active ? 'Active' : 'Hidden'); ?>

            </span>
          </div>
          <div class="table__actions">
            <a class="btn btn--ghost btn--small" href="<?php echo e(route('admin.products.edit', $product)); ?>">Edit</a>
            <form class="table__actionForm" method="POST" action="<?php echo e(route('admin.products.destroy', $product)); ?>">
              <?php echo csrf_field(); ?>
              <?php echo method_field('DELETE'); ?>
              <button class="btn btn--danger btn--small" type="submit">Delete</button>
            </form>
          </div>
        </div>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
        <div class="empty">
          <div class="empty__title">No products yet</div>
          <div class="empty__subtitle">Create your first product to start managing the catalog.</div>
        </div>
      <?php endif; ?>
    </div>

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
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/admin/products/index.blade.php ENDPATH**/ ?>