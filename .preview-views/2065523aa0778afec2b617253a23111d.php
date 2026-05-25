<?php $__env->startSection('title', 'GiftNest - Cart'); ?>

<?php
  $total = $subtotal + $shipping;
?>

<?php $__env->startSection('content'); ?>
  <section class="section section--tight">
    <div class="section__head">
      <div>
        <h1>Cart</h1>
        <div class="muted">Review your selected products before moving to checkout.</div>
      </div>
      <?php if(session('status')): ?>
        <div class="chip chip--strong"><?php echo e(session('status')); ?></div>
      <?php endif; ?>
    </div>
  </section>

  <section class="section">
    <div class="cart">
      <div class="card cart__items">
        <?php $__empty_1 = true; $__currentLoopData = $cartItems; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
          <div class="cartrow">
            <div class="cartrow__media">
              <?php
                $imageUrl = $item['image_url'] ?? null;
                $imagePath = ! $imageUrl && $item['image'] ? public_path('images/products/' . $item['image']) : null;
                $imageUrl = $imageUrl ?: ($imagePath && file_exists($imagePath)
                  ? asset('images/products/' . $item['image'])
                  : '');
              ?>

              <?php if($imageUrl): ?>
                <img src="<?php echo e($imageUrl); ?>" alt="<?php echo e($item['name']); ?>" class="cartrow__image" />
              <?php else: ?>
                <div class="cartrow__placeholder">GiftNest</div>
              <?php endif; ?>
            </div>

            <div class="cartrow__main">
              <div class="cartrow__title"><?php echo e($item['name']); ?></div>
              <div class="muted small">Tk <?php echo e(number_format((float) $item['price'], 2)); ?> each</div>
            </div>

            <form class="cartrow__form" method="POST" action="<?php echo e(route('cart.update', $item['id'])); ?>">
              <?php echo csrf_field(); ?>
              <?php echo method_field('PATCH'); ?>
              <label class="field">
                <span class="field__label">Qty</span>
                <input class="input" type="number" min="1" name="quantity" value="<?php echo e($item['quantity']); ?>" />
              </label>
              <button class="btn btn--ghost btn--small" type="submit">Update</button>
            </form>

            <div class="cartrow__price">Tk <?php echo e(number_format((float) $item['total'], 2)); ?></div>

            <form method="POST" action="<?php echo e(route('cart.destroy', $item['id'])); ?>">
              <?php echo csrf_field(); ?>
              <?php echo method_field('DELETE'); ?>
              <button class="btn btn--danger btn--small" type="submit">Remove</button>
            </form>
          </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
          <div class="empty">
            <div class="empty__title">Your cart is empty</div>
            <div class="empty__subtitle">Add something from the shop to get started.</div>
            <a class="btn" href="<?php echo e(route('shop')); ?>">Browse products</a>
          </div>
        <?php endif; ?>
      </div>

      <aside class="card cart__summary">
        <div class="cart__summaryTitle">Order summary</div>
        <div class="cart__summaryRow">
          <span class="muted">Subtotal</span>
          <span>Tk <?php echo e(number_format((float) $subtotal, 2)); ?></span>
        </div>
        <div class="cart__summaryRow">
          <span class="muted">Shipping</span>
          <span>Tk <?php echo e(number_format((float) $shipping, 2)); ?></span>
        </div>
        <div class="divider"></div>
        <div class="cart__summaryRow cart__summaryRow--total">
          <span>Total</span>
          <span>Tk <?php echo e(number_format((float) $total, 2)); ?></span>
        </div>
        <a class="btn btn--full" href="<?php echo e(route('checkout')); ?>">Checkout</a>
      </aside>
    </div>
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/pages/cart.blade.php ENDPATH**/ ?>