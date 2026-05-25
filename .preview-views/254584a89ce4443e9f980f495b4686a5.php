<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
  'product',
]));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter(([
  'product',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<?php
  $imageUrl = $product->image_url ?? null;
  $imagePath = ! $imageUrl && $product->image ? public_path('images/products/' . $product->image) : null;
  $hasImage = $imagePath && file_exists($imagePath);
  $imageUrl = $imageUrl ?: ($hasImage ? asset('images/products/' . $product->image) : '');
?>

<article class="card product-card">
  <a class="product-card__media" href="<?php echo e(route('product.show', ['product' => $product->id])); ?>">
    <div class="product-card__frame">
      <?php if($hasImage): ?>
        <img src="<?php echo e($imageUrl); ?>" alt="<?php echo e($product->name); ?>" loading="lazy" />
      <?php else: ?>
        <div class="product-card__placeholder" aria-hidden="true">
          <span>GiftNest</span>
        </div>
      <?php endif; ?>
    </div>
    <span class="pill">Gift Item</span>
  </a>

  <div class="product-card__body">
    <div class="product-card__meta">
      <span>GiftNest</span>
      <span>Product #<?php echo e($product->id); ?></span>
    </div>
    <h3 class="product-card__title">
      <a href="<?php echo e(route('product.show', ['product' => $product->id])); ?>"><?php echo e($product->name); ?></a>
    </h3>
    <div class="product-card__note"><?php echo e(\Illuminate\Support\Str::limit($product->description, 72)); ?></div>
    <div class="product-card__row">
      <div class="price">Tk <?php echo e(number_format((float) $product->price, 2)); ?></div>
      <div class="product-card__actions">
        <form method="POST" action="<?php echo e(route('cart.store', $product)); ?>">
          <?php echo csrf_field(); ?>
          <button class="btn btn--ghost btn--small" type="submit">Add</button>
        </form>
        <a class="btn btn--small" href="<?php echo e(route('product.show', ['product' => $product->id])); ?>">Details</a>
      </div>
    </div>
  </div>
</article>
<?php /**PATH E:\Shihab\Web Development\GiftNest\resources\views/components/product-card.blade.php ENDPATH**/ ?>