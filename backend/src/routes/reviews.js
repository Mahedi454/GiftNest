import { Router } from 'express';
import mongoose from 'mongoose';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { HttpError, asyncHandler, pageResult, paginate, validate } from '../utils/http.js';
import { refreshRating, shapeReview } from '../utils/reviews.js';

const router = Router();

const checkRating = (value) => {
  const rating = Number(value);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? '' : 'Please choose a star rating.';
};
const checkComment = (value) => {
  const text = String(value || '').trim();
  if (text.length < 3) return 'Please write a few words about the product.';
  if (text.length > 1000) return 'Your review is too long (1000 characters at most).';
  return '';
};

async function findActiveProduct(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, 'That product could not be found.');
  const product = await Product.findOne({ _id: id, isActive: true });
  if (!product) throw new HttpError(404, 'That product could not be found.');
  return product;
}

// ---------- Public: read reviews for a product ----------
router.get(
  '/products/:id/reviews',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const product = await findActiveProduct(req.params.id);
    const { page, limit, skip } = paginate(req.query, { defaultLimit: 5 });
    const sort = { highest: { rating: -1, createdAt: -1 }, lowest: { rating: 1, createdAt: -1 } }[req.query.sort] || { createdAt: -1 };

    const [items, total, rows, mine] = await Promise.all([
      Review.find({ product: product._id }).sort(sort).skip(skip).limit(limit),
      Review.countDocuments({ product: product._id }),
      Review.aggregate([{ $match: { product: product._id } }, { $group: { _id: '$rating', count: { $sum: 1 } } }]),
      req.user ? Review.findOne({ product: product._id, user: req.user._id }) : null,
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rows.forEach((row) => { distribution[row._id] = row.count; });

    res.json({
      ...pageResult(items.map((r) => shapeReview(r, req.user)), total, page, limit),
      summary: { average: product.ratingAvg || 0, count: product.ratingCount || 0, distribution },
      mine: mine ? shapeReview(mine, req.user) : null,
    });
  }),
);

// ---------- Write a review ----------
router.post(
  '/products/:id/reviews',
  requireAuth,
  asyncHandler(async (req, res) => {
    const product = await findActiveProduct(req.params.id);
    validate({ rating: checkRating(req.body.rating), comment: checkComment(req.body.comment) });

    if (await Review.exists({ product: product._id, user: req.user._id })) {
      throw new HttpError(409, 'You have already reviewed this product. You can edit your review instead.');
    }

    const verified = Boolean(await Order.exists({ user: req.user._id, 'items.product': product._id }));
    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(req.body.rating),
      comment: String(req.body.comment).trim(),
      verified,
    });
    await refreshRating(product._id);
    res.status(201).json({ review: shapeReview(review, req.user) });
  }),
);

// ---------- Edit or delete a review ----------
router.put(
  '/reviews/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw new HttpError(404, 'That review could not be found.');
    if (String(review.user) !== String(req.user._id)) throw new HttpError(403, 'You can only edit your own review.');

    validate({ rating: checkRating(req.body.rating), comment: checkComment(req.body.comment) });
    review.rating = Number(req.body.rating);
    review.comment = String(req.body.comment).trim();
    await review.save();
    await refreshRating(review.product);
    res.json({ review: shapeReview(review, req.user) });
  }),
);

router.delete(
  '/reviews/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw new HttpError(404, 'That review could not be found.');
    const isOwner = String(review.user) === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') throw new HttpError(403, 'You can only delete your own review.');

    await review.deleteOne();
    await refreshRating(review.product);
    res.json({ message: 'Review deleted.' });
  }),
);

// ---------- Replies ----------
router.post(
  '/reviews/:id/replies',
  requireAuth,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw new HttpError(404, 'That review could not be found.');

    const message = String(req.body.message || '').trim();
    validate({ message: !message ? 'Please write a reply.' : message.length > 600 ? 'Your reply is too long (600 characters at most).' : '' });

    review.replies.push({ user: req.user._id, userName: req.user.name, role: req.user.role === 'admin' ? 'admin' : 'user', message });
    await review.save();
    res.status(201).json({ review: shapeReview(review, req.user) });
  }),
);

router.delete(
  '/reviews/:id/replies/:replyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw new HttpError(404, 'That review could not be found.');
    const reply = review.replies.id(req.params.replyId);
    if (!reply) throw new HttpError(404, 'That reply could not be found.');
    if (String(reply.user) !== String(req.user._id) && req.user.role !== 'admin') {
      throw new HttpError(403, 'You can only delete your own reply.');
    }

    reply.deleteOne();
    await review.save();
    res.json({ review: shapeReview(review, req.user) });
  }),
);

export default router;
