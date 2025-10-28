const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const User = require('../models/User');

// POST create order { items: [{product, qty}], total, bulk, contactPhone }
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, bulk, contactPhone } = req.body;
    const order = new Order({ user: req.user.id, items, total, bulk, contactPhone });
    await order.save();
    if (!bulk) {
      const user = await User.findById(req.user.id);
      user.cart = [];
      await user.save();
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
