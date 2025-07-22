const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, getProfile } = require('../controllers/userController');

// Route to send OTP
router.post('/send-otp', sendOTP);

// Route to verify OTP and save user details
router.post('/verify-otp', verifyOTP);

// Route to get user profile by mobile
router.get('/profile/:mobile', getProfile);

module.exports = router;
