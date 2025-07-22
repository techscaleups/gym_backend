const Wishlist = require('../models/wishlistModel');


// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId, selectedSize, selectedColor } = req.body;

    // Check if product already in wishlist
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ message: 'Product is already in wishlist' });
    }

    const newWishlistItem = new Wishlist({
      userId,
      productId,
      selectedSize,
      selectedColor,
      addedAt: new Date()
    });

    const savedItem = await newWishlistItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Failed to add product to wishlist:', err);
    res.status(500).json({ message: 'Failed to add product to wishlist', error: err.message });
  }
};

// Get all wishlist items for a user
exports.getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({ userId })
      .populate({
        path: 'productId',
        select: 'name price images'
      })
      .sort({ addedAt: -1 });

    // Format response with product details
    const formattedWishlist = wishlist.map(item => ({
      _id: item._id,
      userId: item.userId,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      addedAt: item.addedAt,
      product: {
        _id: item.productId?._id || null,
        name: item.productId?.name || null,
        price: item.productId?.price || null,
        image: item.productId?.images?.[0] || null
      }
    }));

    res.status(200).json(formattedWishlist);
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ message: 'Error fetching wishlist', error: err.message });
  }
};

// Remove a wishlist item by id
exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Wishlist.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.status(200).json({ message: 'Wishlist item removed successfully' });
  } catch (err) {
    console.error('Error removing wishlist item:', err);
    res.status(500).json({ message: 'Error removing wishlist item', error: err.message });
  }
};
// Toggle wishlist (add if not present, remove if present)
exports.toggleWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'Missing userId or productId' });
    }

    const item = await Wishlist.findOne({ userId, productId });

    if (item) {
      await Wishlist.findByIdAndDelete(item._id);
      return res.status(200).json({ message: 'Removed from wishlist' });
    } else {
      const newItem = new Wishlist({ userId, productId });
      await newItem.save();
      return res.status(200).json({ message: 'Added to wishlist' });
    }
  } catch (err) {
    console.error("❌ Wishlist Toggle Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

