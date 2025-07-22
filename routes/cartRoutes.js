const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get cart items for a user
router.get('/user/:userId', cartController.getCartItemsByUserId);

// Add item to cart
router.post('/', cartController.addToCart);

// Update quantity of a cart item
router.put('/quantity/:id', cartController.updateCartQuantity);

// Remove item from cart
router.delete('/:id', cartController.removeFromCart);

module.exports = router;
