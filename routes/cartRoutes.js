const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.get('/user/:userId', cartController.getCartItemsByUserId);
router.post('/', cartController.addToCart);
router.put('/quantity/:id', cartController.updateCartQuantity);
router.delete('/:id', cartController.removeFromCart);

module.exports = router;
