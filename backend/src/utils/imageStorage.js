import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';
import { HttpError } from './http.js';

// Where product images go:
//  - Production (Vercel): Cloudinary, because serverless disks are read-only and temporary.
//  - Local development: the backend/uploads folder, so no account is needed to try things out.

const here = path.dirname(fileURLToPath(import.meta.url));
export const uploadDir = path.resolve(here, '../../uploads');

export const cloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET));

let configured = false;
function configureCloudinary() {
  if (configured) return;
  if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  cloudinary.config({ secure: true });
  configured = true;
}

const CLOUDINARY_URL_PATTERN = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i;

// https://res.cloudinary.com/demo/image/upload/v1700000000/giftnest/products/abc123.jpg -> giftnest/products/abc123
export function publicIdFromUrl(imageUrl) {
  const match = CLOUDINARY_URL_PATTERN.exec(imageUrl || '');
  return match ? decodeURIComponent(match[1]) : null;
}

// Stores an uploaded file (from multer's memory storage) and returns the URL/path to save on the product.
export async function saveImage(file) {
  if (cloudinaryConfigured()) {
    configureCloudinary();
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: process.env.CLOUDINARY_FOLDER || 'giftnest/products', resource_type: 'image' }, (error, result) => {
          if (error) reject(new HttpError(502, 'The image could not be uploaded. Please try again.'));
          else resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  }

  if (process.env.VERCEL) {
    throw new HttpError(503, 'Image uploads are not set up yet. Add your Cloudinary details to the backend settings.');
  }

  await fs.promises.mkdir(uploadDir, { recursive: true });
  const ext = path.extname(file.originalname).toLowerCase();
  const name = `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
  await fs.promises.writeFile(path.join(uploadDir, name), file.buffer);
  return `/uploads/${name}`;
}

// Deletes an image we stored. Seeded images (/images/...) and unknown URLs are never touched.
export async function removeImage(imageUrl) {
  if (!imageUrl) return;
  try {
    const publicId = publicIdFromUrl(imageUrl);
    if (publicId && cloudinaryConfigured()) {
      configureCloudinary();
      await cloudinary.uploader.destroy(publicId);
    } else if (imageUrl.startsWith('/uploads/')) {
      await fs.promises.unlink(path.join(uploadDir, path.basename(imageUrl)));
    }
  } catch {
    // A leftover file is harmless; never fail a request over cleanup.
  }
}
