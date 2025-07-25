// models/Product.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  likes: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, required: true, unique: true },
  description: String,
  brand: String,
  category: String,
  price: Number,
  discountPrice: Number,
  stock: Number,
  sizes: [String],
  colors: [String],
  images: [String],
  rating: Number,
  quantity: Number,
  featured: { type: Boolean, default: false },
  isHotPick: { type: Boolean, default: false },
  reviews: [reviewSchema]
});

module.exports = mongoose.model('Product', productSchema);
