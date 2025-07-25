const Razorpay = require('razorpay');
const crypto = require('crypto');
const shortid = require('shortid');
const Payment = require('../models/paymentModel');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.createPayment = async (req, res) => {
  const amount = req.body.amount;

  if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 10000000) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  const options = {
    amount: Math.round(amount ), // in paise
    currency: 'INR',
    receipt: shortid.generate(),
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    return res.status(200).json({
      success: true,
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error('Razorpay error:', error);
    return res.status(500).json({ success: false, message: 'Payment creation failed' });
  }
};

// Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    const paymentExists = await Payment.exists(razorpay_payment_id);
    if (paymentExists) {
      return res.status(400).json({ success: false, message: 'Duplicate payment ID' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Payment.savePayment({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        verifiedAt: new Date(),
      });

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature. Verification failed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ success: false, message: "Server error during payment verification" });
  }
};
