<?php $__env->startSection('title', 'Admin - Orders'); ?>

<?php $__env->startSection('content'); ?>
  <section class="section">
    <div class="section__head">
      <div>
        <h1>Manage orders</h1>
        <div class="muted">Track customer purchases, delivery details, and order progress from one place.</div>
      </div>
    </div>

    <?php if(session('status')): ?>
      <div class="card admin-feedback"><?php echo e(session('status')); ?></div>
    <?php endif; ?>

    <div class="grid grid--4">
      <article class="card kpi">
        <div class="kpi__label">Total orders</div>
        <div class="kpi__value"><?php echo e($orderStats['total']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Pending</div>
        <div class="kpi__value"><?php echo e($orderStats['pending']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Completed</div>
        <div class="kpi__value"><?php echo e($orderStats['completed']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Revenue</div>
        <div class="kpi__value">Tk <?php echo e(number_format((float) $orderStats['revenue'], 2)); ?></div>
      </article>
    </div>
  </section>

  <section class="section section--tight">
    <div class="admin-order-list">
      <?php $__empty_1 = true; $__currentLoopData = $orders; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $order): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
        <article class="card admin-order-card">
          <div class="admin-order-card__top">
            <div>
              <div class="kicker">Order #<?php echo e($order->id); ?></div>
              <h3><?php echo e($order->customer_name); ?></h3>
              <div class="muted small"><?php echo e(optional($order->user)->email ?? 'Guest checkout'); ?></div>
            </div>
            <span class="status <?php echo e($order->status === 'completed' ? 'status--delivered' : 'status--pending'); ?>">
              <?php echo e(ucfirst($order->status)); ?>

            </span>
          </div>

          <div class="admin-order-card__grid">
            <div>
              <div class="admin-order-card__label">Contact</div>
              <div><?php echo e($order->phone); ?></div>
              <div class="muted small"><?php echo e($order->address); ?></div>
            </div>
            <div>
              <div class="admin-order-card__label">Items</div>
              <?php $__currentLoopData = $order->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="muted small"><?php echo e(optional($item->product)->name ?? 'Removed product'); ?> x <?php echo e($item->quantity); ?></div>
              <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
            <div>
              <div class="admin-order-card__label">Total</div>
              <div class="admin-order-card__amount">Tk <?php echo e(number_format((float) $order->total_price, 2)); ?></div>
            </div>
            <div>
              <div class="admin-order-card__label">Update status</div>
              <form class="admin-order-card__form" method="POST" action="<?php echo e(route('admin.orders.status', $order)); ?>">
                <?php echo csrf_field(); ?>
                <?php echo method_field('PATCH'); ?>
                <select class="input" name="status">
                  <option value="pending" <?php if($order->status === 'pending'): echo 'selected'; endif; ?>>Pending</option>
                  <option value="completed" <?php if($order->status === 'completed'): echo 'selected'; endif; ?>>Completed</option>
                </select>
                <button class="btn admin-inline-form__button" type="submit">Update status</button>
              </form>
            </div>
          </div>
        </article>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
        <div class="card empty">
          <div class="empty__title">No orders yet</div>
          <div class="empty__subtitle">Placed orders will appear here for admin review.</div>
        </div>
      <?php endif; ?>
    </div>

    <div class="pagination">
      <?php echo e($orders->links()); ?>

    </div>
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/admin/orders/index.blade.php ENDPATH**/ ?>