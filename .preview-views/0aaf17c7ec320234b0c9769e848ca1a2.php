<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__left">
      <div class="footer__brand">
        <img class="brand__logo" src="/gift-svgrepo-com.svg" alt="GiftNest logo" />
        <div>
          <div class="footer__title">GiftNest</div>
          <div class="footer__subtitle">A simple and modern Laravel gift shop for your university showcase project.</div>
        </div>
      </div>
      <p class="footer__copy">
        Built with reusable Blade components, a clean layout system, and a beginner-friendly storefront structure.
      </p>
      <div class="footer__meta">
        <span class="chip">Laravel MVC</span>
        <span class="chip">Session Cart</span>
        <span class="chip">Responsive UI</span>
      </div>
    </div>

    <div class="footer__right">
      <div class="footer__col">
        <div class="footer__heading">Store</div>
        <a href="<?php echo e(route('home')); ?>">Home</a>
        <a href="<?php echo e(route('shop')); ?>">Shop</a>
        <a href="<?php echo e(route('cart')); ?>">Cart</a>
        <a href="<?php echo e(route('checkout')); ?>">Checkout</a>
      </div>
      <div class="footer__col">
        <div class="footer__heading">Account</div>
        <?php if(auth()->guard()->check()): ?>
          <a href="<?php echo e(route('orders')); ?>">Orders</a>
          <?php if(auth()->user()->isAdmin()): ?>
            <a href="<?php echo e(route('admin.index')); ?>">Admin Panel</a>
          <?php endif; ?>
          <form method="POST" action="<?php echo e(route('logout')); ?>">
            <?php echo csrf_field(); ?>
            <button class="footer__button" type="submit">Logout</button>
          </form>
        <?php else: ?>
          <a href="<?php echo e(route('login')); ?>">Login</a>
          <a href="<?php echo e(route('register')); ?>">Register</a>
        <?php endif; ?>
      </div>
    </div>
  </div>

  <div class="container footer__bottom">
    <span>&copy; <?php echo e(date('Y')); ?> GiftNest. All rights reserved.</span>
    <span class="footer__small">Built with Laravel, Blade, and PostgreSQL.</span>
  </div>
</footer>
<?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/components/footer.blade.php ENDPATH**/ ?>