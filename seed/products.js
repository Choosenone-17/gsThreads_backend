require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const products = [
  { title: 'gsThreads Classic Tee', description: 'Soft cotton tee — perfect for clubs & events.', price: 299, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=60', featured: true },
  { title: 'gsThreads Retro Tee', description: 'Trend-forward style with vibrant print.', price: 399, image: 'https://images.unsplash.com/photo-1520975910163-5b0c3a2b6d39?auto=format&fit=crop&w=1200&q=60', featured: true }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Seeded products');

    if (process.env.INITIAL_ADMIN_EMAIL) {
      const email = process.env.INITIAL_ADMIN_EMAIL;
      const exists = await User.findOne({ email });
      if (!exists) {
        const hashed = await bcrypt.hash('adminpass', 10);
        const admin = new User({ name: 'Admin', email, password: hashed, role: 'admin' });
        await admin.save();
        console.log('Created initial admin:', email, 'password: adminpass');
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
