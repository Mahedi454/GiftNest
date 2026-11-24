import app from './app.js';
import { connectDB } from './config/db.js';

// Long-running server for local development (npm run dev / npm start).
// On Vercel the app is started by api/index.js instead.
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const port = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(port, () => console.log(`GiftNest API listening on http://localhost:${port}`)))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
