const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  slug: {
  type: String,
  required: true,
  unique: true,
},
  description: String,
  brand: String,
  category: String, // e.g., "Supplements", "Equipment"
  price: Number,
  discountPrice: Number,
  stock: Number,
  sizes: [String], // e.g., ["1kg", "2kg"]
  colors: [String], // e.g., ["Black", "Red"]
  images: [String], // Base64 strings or URLs
  rating: Number,
  quantity: Number, 
  featured: { type: Boolean, default: false }, 
isHotPick: {
  type: Boolean,
  default: false
},
// ✅ Track selected quantity (optional)
  reviews: [
    {
      user: String,
      comment: String,
      rating: Number,
      likes: Number,     // ✅ Number of likes
      replies: Number,   // ✅ Number of replies
      time: String       // ✅ e.g., "2 days ago"
    }
  ]
});

module.exports = mongoose.model('Product', productSchema);
