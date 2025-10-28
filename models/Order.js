const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number }],
  total: Number,
  bulk: { type: Boolean, default: false },
  contactPhone: String,
  status: { type: String, enum: ['pending','processing','completed','cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
