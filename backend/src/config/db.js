import mongoose from 'mongoose';

// The connection is cached on `globalThis`. On Vercel each request may run in a warm serverless
// instance, and reusing the connection avoids opening a new one (and exhausting Atlas) every time.
const cache = (globalThis.__giftnestMongo ||= { connection: null, promise: null });

export async function connectDB() {
  if (cache.connection && mongoose.connection.readyState === 1) return cache.connection;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Add it to backend/.env (or the Vercel project settings).');
  if (uri.includes('<username>') || uri.includes('<password>') || uri.includes('<cluster>')) {
    throw new Error('MONGODB_URI still has placeholders. Paste your real MongoDB Atlas connection string.');
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 5 })
      .then(() => {
        console.log('MongoDB connected');
        return mongoose.connection;
      });
  }

  try {
    cache.connection = await cache.promise;
  } catch (error) {
    cache.promise = null; // let the next request try again
    throw error;
  }
  return cache.connection;
}
