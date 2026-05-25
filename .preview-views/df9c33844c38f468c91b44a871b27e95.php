<header class="navbar">
  <?php
    $cartCount = collect(session('cart', []))->sum('quantity');
    $user = auth()->user();
    $userInitials = $user
      ? collect(explode(' ', trim($user->name)))
          ->filter()
          ->take(2)
          ->map(fn ($part) => strtoupper(substr($part, 0, 1)))
          ->implode('')
      : '';
  ?>

  <div class="container navbar__inner">
    <a class="brand" href="<?php echo e(route('home')); ?>">
      <img class="brand__logo" src="/gift-svgrepo-com.svg" alt="GiftNest logo" />
      <span class="brand__name">GiftNest</span>
    </a>

    <nav class="navlinks" aria-label="Primary">
      <a href="<?php echo e(route('home')); ?>">Home</a>
      <a href="<?php echo e(route('shop')); ?>">Shop</a>
      <a href="<?php echo e(route('about')); ?>">About</a>
    </nav>

    <div class="navactions">
      <a class="iconbtn" href="<?php echo e(route('cart')); ?>" aria-label="View cart">
        <svg class="iconbtn__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" />
          <circle cx="10" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
        <?php if($cartCount > 0): ?>
          <span class="badge"><?php echo e($cartCount); ?></span>
        <?php endif; ?>
      </a>

      <?php if(auth()->guard()->check()): ?>
        <?php if(auth()->user()->isAdmin()): ?>
          <a class="btn btn--ghost" href="<?php echo e(route('admin.index')); ?>">Admin</a>
        <?php endif; ?>
        <div class="profilemenu" data-profile-menu>
          <button
            class="profilemenu__trigger"
            type="button"
            aria-label="Open profile menu"
            aria-expanded="false"
            data-profile-menu-toggle
          >
            <span class="profilemenu__avatar"><?php echo e($userInitials); ?></span>
            <span class="profilemenu__meta">
              <span class="profilemenu__name"><?php echo e($user->name); ?></span>
              <span class="profilemenu__role"><?php echo e($user->isAdmin() ? 'Administrator' : 'Customer'); ?></span>
            </span>
          </button>

          <div class="profilemenu__dropdown" data-profile-menu-panel hidden>
            <a class="profilemenu__link" href="<?php echo e(route('profile.edit')); ?>">My profile</a>
            <?php if (! ($user->isAdmin())): ?>
              <a class="profilemenu__link" href="<?php echo e(route('orders')); ?>">My orders</a>
            <?php endif; ?>
            <form method="POST" action="<?php echo e(route('logout')); ?>">
              <?php echo csrf_field(); ?>
              <button class="profilemenu__logout" type="submit">Logout</button>
            </form>
          </div>
        </div>
      <?php else: ?>
        <a class="btn btn--ghost" href="<?php echo e(route('login')); ?>">Login</a>
        <a class="btn" href="<?php echo e(route('register')); ?>">Sign up</a>
      <?php endif; ?>

      <button
        class="hamburger"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="site-mobile-menu"
        data-mobile-menu-toggle
        data-menu-target="site-mobile-menu"
      >
        <img class="hamburger__icon" src="/line-3-svgrepo-com.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  </div>

  <div class="mobilemenu" id="site-mobile-menu" data-mobile-menu hidden>
    <div class="container mobilemenu__inner">
      <div class="mobilemenu__eyebrow">Simple shopping, clean flow</div>
      <a href="<?php echo e(route('home')); ?>">Home</a>
      <a href="<?php echo e(route('shop')); ?>">Shop</a>
      <a href="<?php echo e(route('about')); ?>">About</a>
      <a href="<?php echo e(route('cart')); ?>">Cart</a>
      <div class="mobilemenu__row">
        <?php if(auth()->guard()->check()): ?>
          <?php if(auth()->user()->isAdmin()): ?>
            <a class="btn btn--ghost" href="<?php echo e(route('admin.index')); ?>">Admin</a>
          <?php else: ?>
            <a class="btn btn--ghost" href="<?php echo e(route('orders')); ?>">Orders</a>
          <?php endif; ?>
          <a class="btn btn--ghost" href="<?php echo e(route('profile.edit')); ?>">Profile</a>
          <form method="POST" action="<?php echo e(route('logout')); ?>">
            <?php echo csrf_field(); ?>
            <button class="btn btn--ghost" type="submit">Logout</button>
          </form>
        <?php else: ?>
          <a class="btn btn--ghost" href="<?php echo e(route('login')); ?>">Login</a>
          <a class="btn" href="<?php echo e(route('register')); ?>">Sign up</a>
        <?php endif; ?>
      </div>
    </div>
  </div>
</header>
<?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/components/navbar.blade.php ENDPATH**/ ?>