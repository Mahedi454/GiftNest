import mongoose from 'mongoose';
import { jsonPlugin } from './plugin.js';

// A reply on a review. Anyone signed in can reply; replies from admins are flagged by `role`.
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    message: { type: String, required: true, trim: true, maxlength: 600 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
replySchema.plugin(jsonPlugin);

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Snapshot of the reviewer's name so the review still reads well if the account is removed.
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    // True when the reviewer has bought this product from the store.
    verified: { type: Boolean, default: false },
    replies: { type: [replySchema], default: [] },
  },
  { timestamps: true },
);

// One review per customer per product (they can edit it instead of posting again).
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.plugin(jsonPlugin);

export default mongoose.model('Review', reviewSchema);
