const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart || []);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST add/update an item { productId, qty }
router.post('/', auth, async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user.id);
    const exists = user.cart.find(i => i.product.toString() === productId);
    if (exists) {
      exists.qty = qty;
    } else {
      user.cart.push({ product: productId, qty });
    }
    await user.save();
    const populated = await User.findById(req.user.id).populate('cart.product');
    res.json(populated.cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE remove item
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(i => i.product.toString() !== productId);
    await user.save();
    const populated = await User.findById(req.user.id).populate('cart.product');
    res.json(populated.cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
