<?php $__env->startSection('title', 'Admin - Users'); ?>

<?php $__env->startSection('content'); ?>
  <section class="section">
    <div class="section__head">
      <div>
        <h1>Manage users</h1>
        <div class="muted">Separate admins from customers and control permissions from one secure screen.</div>
      </div>
    </div>

    <?php if(session('status')): ?>
      <div class="card admin-feedback"><?php echo e(session('status')); ?></div>
    <?php endif; ?>

    <div class="grid grid--3">
      <article class="card kpi">
        <div class="kpi__label">Total users</div>
        <div class="kpi__value"><?php echo e($userStats['total']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Administrators</div>
        <div class="kpi__value"><?php echo e($userStats['admins']); ?></div>
      </article>
      <article class="card kpi">
        <div class="kpi__label">Customers</div>
        <div class="kpi__value"><?php echo e($userStats['customers']); ?></div>
      </article>
    </div>
  </section>

  <section class="section section--tight">
    <div class="card table">
      <div class="table__row table__head table__row--users">
        <div>User</div>
        <div>Email</div>
        <div>Role</div>
        <div>Joined</div>
        <div>Actions</div>
      </div>

      <?php $__empty_1 = true; $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
        <div class="table__row table__row--users">
          <div>
            <strong><?php echo e($user->name); ?></strong>
          </div>
          <div><?php echo e($user->email); ?></div>
          <div>
            <span class="status <?php echo e($user->role === 'admin' ? 'status--delivered' : 'status--shipped'); ?>">
              <?php echo e($user->role === 'admin' ? 'Administrator' : 'Customer'); ?>

            </span>
          </div>
          <div><?php echo e($user->created_at->format('d M Y')); ?></div>
          <div class="table__actions table__actions--users">
            <form class="admin-inline-form admin-inline-form--role" method="POST" action="<?php echo e(route('admin.users.role', $user)); ?>">
              <?php echo csrf_field(); ?>
              <?php echo method_field('PATCH'); ?>
              <select class="input" name="role">
                <option value="user" <?php if($user->role === 'user'): echo 'selected'; endif; ?>>User</option>
                <option value="admin" <?php if($user->role === 'admin'): echo 'selected'; endif; ?>>Admin</option>
              </select>
              <button class="btn admin-inline-form__button" type="submit">Update role</button>
            </form>
          </div>
        </div>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
        <div class="empty">
          <div class="empty__title">No users yet</div>
          <div class="empty__subtitle">Registered accounts will appear here for admin role management.</div>
        </div>
      <?php endif; ?>
    </div>

    <div class="pagination">
      <?php if($users->onFirstPage()): ?>
        <span class="pagination__link pagination__link--disabled">Prev</span>
      <?php else: ?>
        <a class="pagination__link" href="<?php echo e($users->previousPageUrl()); ?>">Prev</a>
      <?php endif; ?>

      <?php $__currentLoopData = $users->getUrlRange(1, $users->lastPage()); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $page => $url): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <a class="pagination__link <?php echo e($page === $users->currentPage() ? 'pagination__link--active' : ''); ?>" href="<?php echo e($url); ?>">
          <?php echo e($page); ?>

        </a>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

      <?php if($users->hasMorePages()): ?>
        <a class="pagination__link" href="<?php echo e($users->nextPageUrl()); ?>">Next</a>
      <?php else: ?>
        <span class="pagination__link pagination__link--disabled">Next</span>
      <?php endif; ?>
    </div>
  </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/admin/users/index.blade.php ENDPATH**/ ?>