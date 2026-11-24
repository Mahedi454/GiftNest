import path from 'node:path';
import multer from 'multer';
import { HttpError } from '../utils/http.js';

const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

// Files are kept in memory and handed to utils/imageStorage.js, which decides where they live.
// (Vercel limits request bodies to about 4.5 MB, so 4 MB is the practical ceiling.)
export const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = allowed.has(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new HttpError(422, 'Image must be jpg, png, webp, gif or avif.'), ok);
  },
}).single('image');
