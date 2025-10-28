const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  cart: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
