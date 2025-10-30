const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/demo/image/upload/v1710000000/placeholder_tshirt.png',
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sizes: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      default: ['M', 'L', 'XL'],
    },
    stock: {
      type: Number,
      default: 100,
      min: [0, 'Stock cannot be negative'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
