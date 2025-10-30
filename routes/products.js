const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ✅ Get all products (with search, filter, pagination)
router.get('/', async (req, res) => {
  try {
    const { q, featured, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (q) filter.title = { $regex: q, $options: 'i' };
    if (featured === 'true') filter.featured = true;

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
