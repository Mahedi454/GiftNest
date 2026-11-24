import { Router } from 'express';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { removeUploadedImage, uploadProductImage } from '../middleware/upload.js';
import { HttpError, asyncHandler, pageResult, paginate, validate } from '../utils/http.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const toBool = (value) => value === true || value === 'true' || value === '1' || value === 'on';

// ---------- Dashboard ----------
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const [users, products, orders, revenue] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    ]);
    res.json({ stats: { users, products, orders, revenue: revenue[0]?.total || 0 } });
  }),
);

// ---------- Products ----------
router.get(
  '/products',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const [items, total, active, categories, lowStock] = await Promise.all([
      Product.find().populate('category').sort('-createdAt').skip(skip).limit(limit),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Category.countDocuments(),
      Product.countDocuments({ stock: { $lte: 5 } }),
    ]);
    res.json({ ...pageResult(items, total, page, limit), stats: { total, active, categories, lowStock } });
  }),
);

router.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) throw new HttpError(404, 'Product not found.');
    res.json({ product });
  }),
);

async function readProductBody(body) {
  const price = Number(body.price);
  const stock = Number(body.stock);
  validate({
    name: !String(body.name || '').trim() ? 'The name field is required.' : '',
    category: !body.category || !(await Category.exists({ _id: body.category }).catch(() => null)) ? 'Select a valid category.' : '',
    price: body.price === '' || body.price == null || Number.isNaN(price) || price < 0 ? 'The price must be a number of 0 or more.' : '',
    stock: body.stock === '' || body.stock == null || !Number.isInteger(stock) || stock < 0 ? 'The stock must be a whole number of 0 or more.' : '',
    description: !String(body.description || '').trim() ? 'The description field is required.' : '',
  });
  return {
    name: body.name,
    category: body.category,
    price,
    stock,
    description: body.description,
    isActive: toBool(body.isActive),
  };
}

router.post(
  '/products',
  uploadProductImage,
  asyncHandler(async (req, res) => {
    try {
      const data = await readProductBody(req.body);
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      const product = await Product.create(data);
      res.status(201).json({ product: await product.populate('category') });
    } catch (error) {
      if (req.file) removeUploadedImage(`/uploads/${req.file.filename}`);
      throw error;
    }
  }),
);

router.put(
  '/products/:id',
  uploadProductImage,
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) throw new HttpError(404, 'Product not found.');

      const data = await readProductBody(req.body);
      const previousImage = product.image;

      if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
      } else if (toBool(req.body.removeImage)) {
        data.image = '';
      }

      Object.assign(product, data);
      await product.save();
      if (data.image !== undefined && data.image !== previousImage) removeUploadedImage(previousImage);

      res.json({ product: await product.populate('category') });
    } catch (error) {
      if (req.file) removeUploadedImage(`/uploads/${req.file.filename}`);
      throw error;
    }
  }),
);

router.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(404, 'Product not found.');
    await product.deleteOne();
    removeUploadedImage(product.image);
    res.json({ message: 'Product deleted successfully.' });
  }),
);

// ---------- Categories ----------
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query, { defaultLimit: 8 });
    const [categories, total, counts] = await Promise.all([
      Category.find().sort('name').skip(skip).limit(limit),
      Category.countDocuments(),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    const items = categories.map((c) => ({ ...c.toJSON(), productsCount: countMap.get(String(c._id)) || 0 }));

    const allCategoryIds = await Category.find().select('_id');
    const withProducts = allCategoryIds.filter((c) => countMap.has(String(c._id))).length;
    res.json({
      ...pageResult(items, total, page, limit),
      stats: { total, withProducts, empty: total - withProducts },
    });
  }),
);

const readCategoryName = (body) => {
  const name = String(body.name || '').trim();
  validate({ name: !name ? 'The name field is required.' : name.length > 255 ? 'The name may not be longer than 255 characters.' : '' });
  return name;
};

router.post(
  '/categories',
  asyncHandler(async (req, res) => {
    const name = readCategoryName(req.body);
    if (await Category.exists({ name })) throw new HttpError(422, 'That category already exists.', { name: 'That category already exists.' });
    res.status(201).json({ category: await Category.create({ name }) });
  }),
);

router.put(
  '/categories/:id',
  asyncHandler(async (req, res) => {
    const name = readCategoryName(req.body);
    if (await Category.exists({ name, _id: { $ne: req.params.id } })) {
      throw new HttpError(422, 'That category already exists.', { name: 'That category already exists.' });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!category) throw new HttpError(404, 'Category not found.');
    res.json({ category });
  }),
);

router.delete(
  '/categories/:id',
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new HttpError(404, 'Category not found.');
    if (await Product.exists({ category: category._id })) {
      throw new HttpError(409, 'Delete or move products from this category first.');
    }
    await category.deleteOne();
    res.json({ message: 'Category deleted successfully.' });
  }),
);

// ---------- Orders ----------
router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const [items, total, pending, completed, revenue] = await Promise.all([
      Order.find().populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    ]);
    res.json({ ...pageResult(items, total, page, limit), stats: { total, pending, completed, revenue: revenue[0]?.total || 0 } });
  }),
);

router.patch(
  '/orders/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    validate({ status: !['pending', 'completed'].includes(status) ? 'Status must be pending or completed.' : '' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email');
    if (!order) throw new HttpError(404, 'Order not found.');
    res.json({ order });
  }),
);

// ---------- Users ----------
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const [items, total, admins] = await Promise.all([
      User.find().sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
    ]);
    res.json({ ...pageResult(items, total, page, limit), stats: { total, admins, customers: total - admins } });
  }),
);

router.patch(
  '/users/:id/role',
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    validate({ role: !['admin', 'user'].includes(role) ? 'Role must be admin or user.' : '' });
    if (String(req.user._id) === req.params.id && role !== 'admin') {
      throw new HttpError(409, 'You cannot remove admin access from your own account.');
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) throw new HttpError(404, 'User not found.');
    res.json({ user });
  }),
);

export default router;
