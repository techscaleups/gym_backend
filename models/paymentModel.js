const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  signature: { type: String, required: true },
  verifiedAt: { type: Date, default: Date.now },
  // Add more fields as needed
});

paymentSchema.statics.exists = async function(paymentId) {
  return await this.exists({ paymentId });
};

paymentSchema.statics.savePayment = async function(paymentData) {
  const payment = new this(paymentData);
  return await payment.save();
};

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
