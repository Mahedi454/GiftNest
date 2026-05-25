<?php $__env->startSection('title', 'GiftNest - Login'); ?>

<?php $__env->startSection('content'); ?>
  <section class="section auth">
    <div class="auth__shell">
      <div class="auth__intro">
        <div class="kicker">Authentication</div>
        <h1>Login to GiftNest</h1>
        <p class="lead">Use the standard GiftNest sign-in flow to access your orders or admin panel.</p>
        <div class="auth__highlights">
          <span class="chip">Laravel Breeze</span>
          <span class="chip">Session authentication</span>
          <span class="chip">Role-based redirect</span>
        </div>
      </div>

      <div class="auth__card card">
        <div class="auth__cardHead">
          <h2>Sign in</h2>
          <p class="muted">Use your account email and password.</p>
        </div>

        <?php if(session('status')): ?>
          <p class="muted"><?php echo e(session('status')); ?></p>
        <?php endif; ?>

        <form class="auth__form" method="POST" action="<?php echo e(route('login')); ?>">
          <?php echo csrf_field(); ?>
          <label class="field">
            <span class="field__label">Email</span>
            <input class="input" type="email" name="email" value="<?php echo e(old('email')); ?>" placeholder="you@example.com" required autofocus autocomplete="username" />
            <?php $__errorArgs = ['email'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> <span class="muted"><?php echo e($message); ?></span> <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
          </label>
          <label class="field">
            <span class="field__label">Password</span>
            <input class="input" type="password" name="password" placeholder="Enter your password" required autocomplete="current-password" />
            <?php $__errorArgs = ['password'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> <span class="muted"><?php echo e($message); ?></span> <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
          </label>
          <label class="field field--inline">
            <input type="checkbox" name="remember" value="1" <?php if(old('remember')): echo 'checked'; endif; ?> />
            <span class="field__label">Remember me</span>
          </label>
          <?php if(Route::has('password.request')): ?>
            <a class="link" href="<?php echo e(route('password.request')); ?>">Forgot your password?</a>
          <?php endif; ?>
          <button class="btn btn--full" type="submit">Login</button>
        </form>

        <div class="auth__bottom">
          <span class="muted">Need an account?</span>
          <a class="link" href="<?php echo e(route('register')); ?>">Create one</a>
        </div>
      </div>
    </div>
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/pages/login.blade.php ENDPATH**/ ?>