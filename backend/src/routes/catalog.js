import { Router } from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { HttpError, asyncHandler, escapeRegex, pageResult, paginate } from '../utils/http.js';

const router = Router();

router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    res.json({ categories: await Category.find().sort('name') });
  }),
);

router.get(
  '/products/home',
  asyncHandler(async (_req, res) => {
    const [products, categoryCount] = await Promise.all([
      Product.find({ isActive: true }).populate('category').sort('-createdAt').limit(7),
      Category.countDocuments(),
    ]);
    res.json({
      heroProducts: products.slice(0, 3),
      featuredProducts: products.slice(3, 7),
      categoryCount,
    });
  }),
);

router.get(
  '/products',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = { isActive: true };

    const search = String(req.query.search || '').trim();
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: rx }, { description: rx }];
    }

    const categoryName = String(req.query.category || '').trim();
    if (categoryName) {
      const category = await Category.findOne({ name: new RegExp(`^${escapeRegex(categoryName)}$`, 'i') });
      filter.category = category ? category._id : null;
    }

    const [items, total] = await Promise.all([
      Product.find(filter).populate('category').sort('-createdAt').skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);
    res.json(pageResult(items, total, page, limit));
  }),
);

router.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate('category');
    if (!product) throw new HttpError(404, 'That product could not be found.');

    const relatedProducts = await Product.find({ isActive: true, _id: { $ne: product._id } })
      .populate('category')
      .sort('-createdAt')
      .limit(4);
    res.json({ product, relatedProducts });
  }),
);

export default router;
