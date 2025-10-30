const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // you'll create this file below

// ✅ Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gsThreads/products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// ✅ Create product with image upload
router.post('/product', auth, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const imageUrl = req.file?.path; // Cloudinary hosted URL

    if (!imageUrl) {
      return res.status(400).json({ msg: 'Image upload failed' });
    }

    const product = new Product({
      title,
      description,
      price,
      category,
      image: imageUrl,
    });

    await product.save();
    res.json({ msg: '✅ Product created successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ Update product (with optional image upload)
router.put('/product/:id', auth, admin, upload.single('image'), async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.image = req.file.path; // replace image if new one uploaded
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ Delete product
router.delete('/product/:id', auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ List orders
router.get('/orders', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ Update order status
router.put('/order/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ List users
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
