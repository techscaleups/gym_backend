const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// ✅ Get all cart items for a user
exports.getCartItemsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const cartItems = await Cart.find({ userId }).populate({
      path: 'productId',
      select: 'name price discountPrice images sizes colors stock'
    });

    const formattedCart = cartItems
      .filter(item => item.productId) // Ensure product still exists
      .map(item => ({
        _id: item._id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        addedAt: item.addedAt,
        product: {
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          discountPrice: item.productId.discountPrice,
          images: item.productId.images,
          sizes: item.productId.sizes,
          colors: item.productId.colors,
          stock: item.productId.stock
        }
      }));

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('❌ Error fetching cart items:', error);
    res.status(500).json({ message: 'Server error while fetching cart items', error });
  }
};

// ✅ Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, selectedSize, selectedColor, quantity } = req.body;

    if (!userId || !productId || !selectedSize || !selectedColor || quantity < 1) {
      return res.status(400).json({ message: 'All fields are required and quantity must be >= 1' });
    }

    const existingItem = await Cart.findOne({
      userId,
      productId,
      selectedSize,
      selectedColor
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({ message: 'Quantity updated', cart: existingItem });
    }

    const newItem = new Cart({ userId, productId, selectedSize, selectedColor, quantity });
    const savedItem = await newItem.save();
    res.status(201).json({ message: 'Item added to cart', cart: savedItem });
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
};

// ✅ Update quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const updatedItem = await Cart.findByIdAndUpdate(
      id,
      { $set: { quantity } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Quantity updated successfully', cart: updatedItem });
  } catch (error) {
    console.error('❌ Failed to update quantity:', error);
    res.status(500).json({ message: 'Error updating quantity', error });
  }
};

// ✅ Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Cart.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('❌ Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item', error });
  }
};
