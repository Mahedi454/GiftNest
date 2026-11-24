import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const imageDir = path.resolve(here, '../public/images/products');

const categories = [
  'Birthday Gifts', 'Flowers', 'Jewelry', 'Chocolates', 'Gift Boxes',
  'Gift Hampers', 'Chocolate Bouquets', 'Perfumes', 'Personalized Gifts', 'Stationery',
];

const products = [
  ['Birthday Explosion Box', 'Birthday Gifts', 1350, 'birthday-explosion-box-1-1775137995.webp', 'A handcrafted birthday surprise box filled with layers of wishes and sweet memories.', 16],
  ['Birthday Explosion Box Deluxe', 'Birthday Gifts', 1490, 'birthday-explosion-box-3-1775391298.jpg', 'A deluxe explosion box styled for birthdays, proposals, and personal keepsakes.', 12],
  ['Custom Birthday Mug', 'Birthday Gifts', 490, 'custom-birthday-mug-1-1775137710.jpg', 'A personalized birthday mug with custom name or message for everyday smiles.', 35],
  ['Custom Birthday Mug Classic', 'Birthday Gifts', 520, 'custom-birthday-mug-2-1775391193.jpg', 'A classic personalized mug layout for birthday wishes and everyday gifting.', 28],
  ['LED Birthday Name Lamp', 'Birthday Gifts', 1250, 'led-birthday-name-lamp-1-1775137577.webp', 'A glowing acrylic lamp customized with a birthday name for a warm decorative touch.', 14],
  ['LED Birthday Name Lamp Premium', 'Birthday Gifts', 1350, 'led-birthday-name-lamp-2-1775391126.webp', 'A premium LED name lamp with a warm glow for personalized birthday decor.', 10],
  ['Personalized Birthday Photo Frame', 'Birthday Gifts', 990, 'personalized-birthday-photo-frame-1775137597.webp', 'A custom birthday photo frame that turns favorite moments into a keepsake gift.', 20],
  ['Personalized Birthday Photo Frame Classic', 'Birthday Gifts', 1090, 'personalized-birthday-photo-frame-1775391082.webp', 'A classic birthday photo frame for preserving one favorite celebration moment.', 18],
  ['Couple Name Engraved Bracelet', 'Jewelry', 990, 'couple-name-engraved-bracelet-2-1775391388.webp', 'A personalized couple bracelet with engraved names for romantic gifting.', 20],
  ['LED Eternal Rose Dome', 'Flowers', 1790, 'led-eternal-rose-dome-1775391543.webp', 'A glowing eternal rose dome that blends floral style with decorative lighting.', 9],
  ['Love Message Bottle', 'Personalized Gifts', 690, 'love-message-bottle-2-1775391437.jpg', 'A tiny message bottle designed for heartfelt notes and romantic surprises.', 24],
  ['Love Candle Gift', 'Personalized Gifts', 850, 'love-candle-2-1775393357.webp', 'A decorative candle gift with a soft romantic mood for cozy celebrations.', 17],
  ['Deluxe Chocolate Gift Basket', 'Gift Hampers', 2190, 'deluxe-chocolate-gift-basket-1775393419.jpg', 'A full chocolate basket packed for birthdays, visits, and festive sharing.', 11],
  ['Celebration Cake Box', 'Gift Boxes', 1590, 'celebration-cake-box-1775393485.jpg', 'A celebration cake box arranged for memorable birthdays and small parties.', 12],
  ['Brain Teaser Puzzle Gift Box', 'Gift Boxes', 1190, 'brain-teaser-puzzle-gift-box-1775393557.jpg', 'A puzzle-themed gift box for playful minds and creative celebrations.', 15],
  ['Cartoon Printed Kids Bottle', 'Personalized Gifts', 640, 'cartoon-printed-kids-bottle-1775393182.jpg', 'A cheerful printed bottle for kids, school days, and practical gifting.', 22],
  ['Custom Baby Name Cushion', 'Personalized Gifts', 890, 'custom-baby-name-cushion-1775393115.jpg', 'A soft baby name cushion made for nursery decor and thoughtful family gifts.', 14],
  ['Personalized Family Name Wall Sign', 'Personalized Gifts', 1490, 'personalized-family-name-wall-sign-1775392710.jpg', 'A customized family name wall sign for home decor and housewarming gifts.', 10],
  ['Family Heritage Photo Frame', 'Personalized Gifts', 1590, 'family-heritage-photo-frame-2-1775392616.avif', 'A heritage-inspired photo frame for family memories and meaningful displays.', 8],
  ['Artistic Family Canvas', 'Personalized Gifts', 1890, 'artistic-family-canvas-1775392876.avif', 'An artistic canvas print for family portraits, wall art, and keepsake gifting.', 9],
  ['Handmade Memory Scrapbook', 'Gift Boxes', 1290, 'handmade-memory-scrapbook-1775392787.webp', 'A handmade scrapbook for collecting photos, notes, and celebration memories.', 13],
  ['Graduation Surprise Memory Box', 'Gift Boxes', 1690, 'graduation-surprise-memory-box-1775392955.avif', 'A graduation-themed memory box for achievements, photos, and small keepsakes.', 7],
  ['Achievement Trophy', 'Personalized Gifts', 1390, 'achievement-trophy-1775393036.jpg', 'A trophy-style achievement gift for graduations, wins, and special milestones.', 10],
  ['Modern Aesthetic Wall Art Frame', 'Personalized Gifts', 1790, 'modern-aesthetic-wall-art-frame-1775393307.webp', 'A modern wall art frame designed for home decor and elegant gifting.', 12],
];

async function seed() {
  await connectDB();

  const categoryDocs = {};
  for (const name of categories) {
    categoryDocs[name] = await Category.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
  }

  const available = new Set(fs.readdirSync(imageDir));
  for (const [name, category, price, file, description, stock] of products) {
    if (!available.has(file)) continue;
    await Product.findOneAndUpdate(
      { image: `/images/products/${file}` },
      { name, description, price, stock, isActive: true, category: categoryDocs[category]._id, image: `/images/products/${file}` },
      { upsert: true },
    );
  }

  console.log(`Seeded ${await Category.countDocuments()} categories and ${await Product.countDocuments()} products.`);
  console.log('Next: set ADMIN_PASSWORD in backend/.env and run "npm run admin" to create the administrator.');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
