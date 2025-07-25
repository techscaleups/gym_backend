const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController'); 

router.post('/create-order', paymentController.createPayment);  
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;
