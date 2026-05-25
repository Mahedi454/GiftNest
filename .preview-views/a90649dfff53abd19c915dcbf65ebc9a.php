<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0b1220" />
    <title><?php echo $__env->yieldContent('title', 'Admin - GiftNest'); ?></title>
    <link rel="icon" type="image/svg+xml" href="/gift-svgrepo-com.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/css/main.css" />
    <link rel="stylesheet" href="/css/components.css" />
    <link rel="stylesheet" href="/css/responsive.css" />
  </head>
  <body class="admin">
    <?php
      $user = auth()->user() ?? app(\App\Services\DemoProductService::class)->demoUser();
      $userInitials = $user
        ? collect(explode(' ', trim($user->name)))
            ->filter()
            ->take(2)
            ->map(fn ($part) => strtoupper(substr($part, 0, 1)))
            ->implode('')
        : '';
    ?>

    <header class="admin-topbar">
      <div class="container admin-topbar__inner">
        <a class="brand" href="<?php echo e(route('admin.index')); ?>">
          <img class="brand__logo" src="/gift-svgrepo-com.svg" alt="GiftNest logo" />
          <span class="brand__name">GiftNest</span>
          <span class="brand__sub">Admin</span>
        </a>
        <nav class="admin-nav" aria-label="Admin navigation">
          <a href="<?php echo e(route('admin.index')); ?>">Dashboard</a>
          <a href="<?php echo e(route('admin.products')); ?>">Products</a>
          <a href="<?php echo e(route('admin.categories')); ?>">Categories</a>
          <a href="<?php echo e(route('admin.orders')); ?>">Orders</a>
          <a href="<?php echo e(route('admin.users')); ?>">Users</a>
        </nav>
        <div class="admin-topbar__actions">
          <a class="btn btn--ghost" href="<?php echo e(route('home')); ?>">View site</a>
          <div class="profilemenu" data-profile-menu>
            <button
              class="profilemenu__trigger"
              type="button"
              aria-label="Open admin profile menu"
              aria-expanded="false"
              data-profile-menu-toggle
            >
              <span class="profilemenu__avatar"><?php echo e($userInitials); ?></span>
              <span class="profilemenu__meta">
                <span class="profilemenu__name"><?php echo e($user->name); ?></span>
                <span class="profilemenu__role">Administrator</span>
              </span>
            </button>

            <div class="profilemenu__dropdown" data-profile-menu-panel hidden>
              <a class="profilemenu__link" href="<?php echo e(route('profile.edit')); ?>">My profile</a>
              <a class="profilemenu__link" href="<?php echo e(route('home')); ?>">View storefront</a>
              <form method="POST" action="<?php echo e(route('logout')); ?>">
                <?php echo csrf_field(); ?>
                <button class="profilemenu__logout" type="submit">Logout</button>
              </form>
            </div>
          </div>
          <button
            class="hamburger admin-hamburger"
            type="button"
            aria-label="Open admin menu"
            aria-expanded="false"
            aria-controls="admin-mobile-menu"
            data-mobile-menu-toggle
            data-menu-target="admin-mobile-menu"
          >
            <img class="hamburger__icon" src="/line-3-svgrepo-com.svg" alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="admin-mobilemenu" id="admin-mobile-menu" data-mobile-menu hidden>
        <div class="container mobilemenu__inner">
          <div class="mobilemenu__eyebrow">Manage the store from any screen</div>
          <a href="<?php echo e(route('admin.index')); ?>">Dashboard</a>
          <a href="<?php echo e(route('admin.products')); ?>">Products</a>
          <a href="<?php echo e(route('admin.categories')); ?>">Categories</a>
          <a href="<?php echo e(route('admin.orders')); ?>">Orders</a>
          <a href="<?php echo e(route('admin.users')); ?>">Users</a>
          <div class="mobilemenu__row">
            <a class="btn btn--ghost" href="<?php echo e(route('profile.edit')); ?>">Profile</a>
            <a class="btn btn--ghost" href="<?php echo e(route('home')); ?>">View site</a>
            <form method="POST" action="<?php echo e(route('logout')); ?>">
              <?php echo csrf_field(); ?>
              <button class="btn" type="submit">Logout</button>
            </form>
          </div>
        </div>
      </div>
    </header>

    <main class="container page">
      <?php echo $__env->yieldContent('content'); ?>
    </main>

    <script src="/js/app.js" defer></script>
  </body>
  </html>
<?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/layouts/admin.blade.php ENDPATH**/ ?>