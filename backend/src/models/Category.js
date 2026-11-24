import mongoose from 'mongoose';
import { jsonPlugin } from './plugin.js';

const categorySchema = new mongoose.Schema(
  { name: { type: String, required: true, unique: true, trim: true, maxlength: 255 } },
  { timestamps: true },
);

categorySchema.plugin(jsonPlugin);

export default mongoose.model('Category', categorySchema);
