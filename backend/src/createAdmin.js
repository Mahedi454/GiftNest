import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';

// Creates the store administrator, or resets their password if the account already exists.
//   1. Put ADMIN_PASSWORD (8+ characters) in backend/.env
//   2. npm run admin
// Add --remove-demo to also delete the old sample accounts from earlier seeds.

const email = (process.env.ADMIN_EMAIL || 'giftnest@admin.com').toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'GiftNest Admin';

async function run() {
  if (!password || password.length < 8) {
    console.error('Set ADMIN_PASSWORD (at least 8 characters) in backend/.env, then run this again.');
    process.exitCode = 1;
    return;
  }

  await connectDB();

  const existing = await User.findOne({ email }).select('+password');
  if (existing) {
    existing.role = 'admin';
    existing.password = password; // hashed automatically on save
    if (!existing.name) existing.name = name;
    await existing.save();
    console.log(`Updated ${email}: administrator access confirmed and password set.`);
  } else {
    await User.create({ name, email, password, role: 'admin' });
    console.log(`Created administrator ${email}.`);
  }

  if (process.argv.includes('--remove-demo')) {
    const removed = await User.deleteMany({ email: { $in: ['admin@giftnest.com', 'customer@example.com'] } });
    console.log(`Removed ${removed.deletedCount} old sample account(s).`);
  }
}

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
