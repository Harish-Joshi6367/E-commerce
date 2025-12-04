/**
 * Run: node seed/seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

connectDB();

const seed = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const shop = new User({ name: 'Default Shop', email: 'shop@example.com', password: 'password123', role: 'shop' });
    await shop.save();

    const products = [
      { name: 'Rice 5kg', description: 'Premium rice', price: 40, category: 'grocery', quantity: 100 },
      { name: 'Olive Oil 1L', description: 'Cooking oil', price: 120, category: 'grocery', quantity: 50 },
      { name: 'Shampoo 500ml', description: 'Hair care', price: 80, category: 'cosmetics', quantity: 70 },
      { name: 'Lipstick', description: 'Classic red', price: 150, category: 'cosmetics', quantity: 30 }
    ];
    await Product.insertMany(products);

    console.log('Seeded DB');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
