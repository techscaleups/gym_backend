const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController'); // Import entire controller

router.post('/create-order', paymentController.createPayment);  // Correct function name
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;
