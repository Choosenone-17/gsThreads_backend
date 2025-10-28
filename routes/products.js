const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products?q=...&featured=true
router.get('/', async (req, res) => {
  try {
    const { q, featured } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (featured === 'true') filter.featured = true;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
