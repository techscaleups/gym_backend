const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, getProfile } = require('../controllers/userController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/profile/:mobile', getProfile);

module.exports = router;
