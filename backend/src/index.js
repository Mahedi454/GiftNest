import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';
import { uploadDir } from './middleware/upload.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import catalogRoutes from './routes/catalog.js';
import orderRoutes from './routes/orders.js';
import profileRoutes from './routes/profile.js';
import reviewRoutes from './routes/reviews.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = express();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Copy server/.env.example to server/.env.');
  process.exit(1);
}

const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((o) => o.trim());
app.use(cors({ origin: origins }));
app.use(express.json());

// Product images: seeded ones ship with the repo, admin uploads land in server/uploads.
app.use('/images', express.static(path.resolve(here, '../public/images'), { maxAge: '7d' }));
app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', reviewRoutes);
app.use('/api', catalogRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(port, () => console.log(`GiftNest API listening on http://localhost:${port}`)))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
