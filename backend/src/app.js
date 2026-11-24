import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import catalogRoutes from './routes/catalog.js';
import orderRoutes from './routes/orders.js';
import profileRoutes from './routes/profile.js';
import reviewRoutes from './routes/reviews.js';
import { cloudinaryConfigured, uploadDir } from './utils/imageStorage.js';

// This file only builds the Express app. It is started by:
//   - src/index.js  (long-running server for local development)
//   - api/index.js  (Vercel serverless function)
const app = express();

// Browsers may call this API from the frontend's origin(s). Set CLIENT_URL to a comma-separated list,
// e.g. https://giftnest.vercel.app,http://localhost:5173  (use * to allow any origin).
const normalise = (url) => url.trim().replace(/\/+$/, '');
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(normalise).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes('*') || allowedOrigins.includes(normalise(origin))),
  }),
);
app.use(express.json());

// Local-only: images uploaded from the admin panel while developing. In production they live on Cloudinary.
if (!process.env.VERCEL) {
  app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }));
}

app.get('/', (_req, res) => res.json({ name: 'GiftNest API', status: 'running' }));

// Quick way to confirm a deployment is configured (reports whether settings exist, never their values).
app.get('/api/health', (_req, res) =>
  res.json({
    ok: true,
    configured: {
      database: Boolean(process.env.MONGODB_URI),
      jwtSecret: Boolean(process.env.JWT_SECRET),
      imageStorage: cloudinaryConfigured() ? 'cloudinary' : 'local disk',
    },
  }),
);

// Everything below needs the secret and a database connection.
app.use('/api', (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'The server is missing its JWT_SECRET setting.' });
  }
  return connectDB().then(() => next(), (error) => {
    console.error('Database connection failed:', error.message);
    res.status(503).json({ message: 'The service is temporarily unavailable. Please try again in a moment.' });
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', reviewRoutes);
app.use('/api', catalogRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
