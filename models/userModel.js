const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  username: { // ✅ Added this line
    type: String,
    unique: true,
    sparse: true, // Optional: allows null but still ensures uniqueness when set
  },

  // ✅ Wishlist: array of product IDs
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],

  // ✅ Cart: array of items with productId and quantity
  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 1,
    },
  }],
}, {
  timestamps: true,
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
