const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.post('/', controller.createProduct);
router.post('/add', controller.createProduct); // optional alias

router.get('/', controller.getAllProducts);
router.get('/featured', controller.getFeaturedProducts);
router.get('/search', controller.searchProducts);

router.get('/getHotPicks', controller.getHotPickProducts);
router.post('/hotpickadd', controller.markAsHotPick);

router.get('/slug/:slug', controller.getProductBySlug);
router.put('/slug/:slug', controller.updateProduct);  // <-- uses slug
router.delete('/slug/:slug', controller.deleteProduct); // <-- uses slug

router.post('/:productId/reviews', controller.addReview);   // Add a review
router.get('/:productId/reviews', controller.getReviews);   // Get reviews



module.exports = router;
