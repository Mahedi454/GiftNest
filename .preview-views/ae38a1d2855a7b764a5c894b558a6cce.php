<?php $__env->startSection('title', 'Admin - Categories'); ?>

<?php $__env->startSection('content'); ?>
  <section class="section">
    <div class="section__head">
      <div>
        <h1>Manage categories</h1>
        <div class="muted">Keep product groups organized so the storefront stays clean and easy to browse.</div>
      </div>
    </div>

    <?php if(session('status')): ?>
      <div class="card admin-feedback"><?php echo e(session('status')); ?></div>
    <?php endif; ?>

    <div class="grid grid--3">
      <article class="card kpi">
        <div class="kpi__label">Total categories</div>
        <div class="kpi__value"><?php echo e($categoryStats['total']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Active groups</div>
        <div class="kpi__value"><?php echo e($categoryStats['with_products']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Empty groups</div>
        <div class="kpi__value"><?php echo e($categoryStats['empty']); ?></div>
      </article>
    </div>
  </section>

  <section class="section section--tight">
    <div class="admin-categories-layout">
      <div class="card admin-category-card">
        <h2>Add category</h2>
        <p class="muted">Create a category and use it immediately in product forms.</p>

        <form class="admin-category-form" method="POST" action="<?php echo e(route('admin.categories.store')); ?>">
          <?php echo csrf_field(); ?>
          <label class="field">
            <span class="field__label">Category name</span>
            <input class="input" type="text" name="name" required />
          </label>
          <button class="btn" type="submit">Create category</button>
        </form>
      </div>

      <div class="card table">
        <div class="table__row table__head table__row--categories">
          <div>Name</div>
          <div>Products</div>
          <div>Actions</div>
        </div>

        <?php $__empty_1 = true; $__currentLoopData = $categories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $category): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
          <div class="table__row table__row--categories">
            <div>
              <strong><?php echo e($category->name); ?></strong>
            </div>
            <div><?php echo e($category->products_count); ?></div>
            <div class="table__actions table__actions--category">
              <form class="admin-inline-form" method="POST" action="<?php echo e(route('admin.categories.update', $category)); ?>">
                <?php echo csrf_field(); ?>
                <?php echo method_field('PUT'); ?>
                <input class="input" type="text" name="name" value="<?php echo e($category->name); ?>" />
                <button class="btn btn--ghost admin-inline-form__button" type="submit">Update</button>
              </form>
              <form class="table__actionForm" method="POST" action="<?php echo e(route('admin.categories.destroy', $category)); ?>">
                <?php echo csrf_field(); ?>
                <?php echo method_field('DELETE'); ?>
                <button class="btn btn--danger btn--small" type="submit">Delete</button>
              </form>
            </div>
          </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
          <div class="empty">
            <div class="empty__title">No categories yet</div>
            <div class="empty__subtitle">Create your first category to organize the catalog.</div>
          </div>
        <?php endif; ?>
      </div>
    </div>

    <div class="pagination">
      <?php if($categories->onFirstPage()): ?>
        <span class="pagination__link pagination__link--disabled">Prev</span>
      <?php else: ?>
        <a class="pagination__link" href="<?php echo e($categories->previousPageUrl()); ?>">Prev</a>
      <?php endif; ?>

      <?php $__currentLoopData = $categories->getUrlRange(1, $categories->lastPage()); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $page => $url): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <a class="pagination__link <?php echo e($page === $categories->currentPage() ? 'pagination__link--active' : ''); ?>" href="<?php echo e($url); ?>">
          <?php echo e($page); ?>

        </a>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

      <?php if($categories->hasMorePages()): ?>
        <a class="pagination__link" href="<?php echo e($categories->nextPageUrl()); ?>">Next</a>
      <?php else: ?>
        <span class="pagination__link pagination__link--disabled">Next</span>
      <?php endif; ?>
    </div>
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/admin/categories/index.blade.php ENDPATH**/ ?>