import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { HttpError } from '../utils/http.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const uploadDir = path.resolve(here, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export const uploadProductImage = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
  }),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = allowed.has(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new HttpError(422, 'Image must be jpg, png, webp, gif or avif.'), ok);
  },
}).single('image');

// Only files created through admin uploads are ever deleted; seeded images are left alone.
export function removeUploadedImage(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  const file = path.join(uploadDir, path.basename(imagePath));
  fs.promises.unlink(file).catch(() => {});
}
