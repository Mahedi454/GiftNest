import mongoose from 'mongoose';
import { jsonPlugin } from './plugin.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 255 },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    // Public URL path: /images/products/x.webp (seeded) or /uploads/x.jpg (admin upload)
    image: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.plugin(jsonPlugin);

export default mongoose.model('Product', productSchema);
