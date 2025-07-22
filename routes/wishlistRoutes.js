const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/', wishlistController.addToWishlist);
router.get('/user/:userId', wishlistController.getWishlistByUser);
router.delete('/remove/:id', wishlistController.removeFromWishlist);
router.post('/toggle', wishlistController.toggleWishlist);

module.exports = router;
