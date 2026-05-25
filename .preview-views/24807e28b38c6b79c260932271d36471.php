<?php $__env->startSection('title', 'GiftNest - Checkout'); ?>

<?php
  $total = $subtotal + $shipping;
  $checkoutUser = auth()->user() ?? app(\App\Services\DemoProductService::class)->demoUser();
?>

<?php $__env->startSection('content'); ?>
  <section class="section section--tight">
    <div class="section__head">
      <div>
        <h1>Checkout</h1>
        <div class="muted">Fill in your delivery information to place the order.</div>
      </div>
      <?php if(session('status')): ?>
        <div class="chip chip--strong"><?php echo e(session('status')); ?></div>
      <?php endif; ?>
    </div>
  </section>

  <section class="section">
    <div class="checkout">
      <form class="card checkout__form" method="POST" action="<?php echo e(route('checkout.store')); ?>">
        <?php echo csrf_field(); ?>
        <div class="formgrid">
          <label class="field">
            <span class="field__label">Name</span>
            <input class="input" type="text" name="name" value="<?php echo e(old('name', $checkoutUser->name)); ?>" required />
            <?php $__errorArgs = ['name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> <span class="muted"><?php echo e($message); ?></span> <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
          </label>

          <label class="field">
            <span class="field__label">Phone</span>
            <input class="input" type="text" name="phone" value="<?php echo e(old('phone')); ?>" required />
            <?php $__errorArgs = ['phone'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> <span class="muted"><?php echo e($message); ?></span> <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
          </label>

          <label class="field field--full">
            <span class="field__label">Address</span>
            <textarea class="input" name="address" rows="5" required><?php echo e(old('address')); ?></textarea>
            <?php $__errorArgs = ['address'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> <span class="muted"><?php echo e($message); ?></span> <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
          </label>
        </div>

        <button class="btn btn--full" type="submit">Place order</button>
      </form>

      <aside class="card checkout__summary">
        <div class="cart__summaryTitle">Order summary</div>
        <?php $__currentLoopData = $cartItems; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <div class="cart__summaryRow">
            <span class="muted"><?php echo e($item['name']); ?> x<?php echo e($item['quantity']); ?></span>
            <span>Tk <?php echo e(number_format((float) ($item['price'] * $item['quantity']), 2)); ?></span>
          </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <div class="divider"></div>
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
      </aside>
    </div>
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/pages/checkout.blade.php ENDPATH**/ ?>