const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Create product
router.post('/product', auth, admin, async (req, res) => {
  try {
    const p = new Product(req.body);
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update product
router.put('/product/:id', auth, admin, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete product
router.delete('/product/:id', auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// List orders
router.get('/orders', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update order status
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

// List users
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
