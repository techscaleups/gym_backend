const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userDetails: {
    name: String,
    email: String,
    phone: String,
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Online Payment'],
    default: 'Cash on Delivery'
  },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      color: String,
      size: String
    }
  ],
  totalAmount: Number,
  placedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending'
  }
});

module.exports = mongoose.model('Order', orderSchema);
