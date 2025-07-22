// models/cartModel.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
  selectedSize: String,
  selectedColor: String,
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
