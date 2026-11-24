import Product from '../models/Product.js';
import Review from '../models/Review.js';

// "Nusrat Jahan Rahman" -> "Nusrat R."  (public pages show a friendlier, more private name)
export function publicName(fullName = '') {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Customer';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

const same = (a, b) => Boolean(a) && Boolean(b) && String(a) === String(b);

export const STORE_NAME = 'GiftNest Team';

// Shapes a review for the API. Reviewer emails and full names are only included for admins.
export function shapeReview(review, viewer, { admin = false } = {}) {
  const doc = review.toObject ? review.toObject({ virtuals: false }) : review;
  const populatedUser = doc.user && doc.user._id ? doc.user : null;
  const authorId = String(populatedUser ? populatedUser._id : doc.user);
  const product = doc.product && doc.product._id ? doc.product : null;

  return {
    id: String(doc._id),
    productId: String(product ? product._id : doc.product),
    ...(admin && product ? { product: { id: String(product._id), name: product.name, image: product.image } } : {}),
    rating: doc.rating,
    comment: doc.comment,
    verified: doc.verified,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    author: admin ? doc.userName : publicName(doc.userName),
    ...(admin && populatedUser ? { email: populatedUser.email } : {}),
    isMine: same(authorId, viewer?._id),
    hasTeamReply: (doc.replies || []).some((r) => r.role === 'admin'),
    replies: (doc.replies || []).map((reply) => ({
      id: String(reply._id),
      message: reply.message,
      createdAt: reply.createdAt,
      isTeam: reply.role === 'admin',
      isReviewer: same(reply.user, authorId),
      isMine: same(reply.user, viewer?._id),
      author: reply.role === 'admin' ? STORE_NAME : admin ? reply.userName : publicName(reply.userName),
    })),
  };
}

// Recalculates the average and count shown on product cards and pages.
export async function refreshRating(productId) {
  const [row] = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Product.updateOne(
    { _id: productId },
    { ratingAvg: row ? Math.round(row.avg * 10) / 10 : 0, ratingCount: row ? row.count : 0 },
  );
}
