// controllers/orderController.js
const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  const {
    userId,
    name,
    email,
    phone,
    address, // now structured
    paymentMethod,
    items,
    totalAmount,
    placedAt
  } = req.body;

  try {
    const newOrder = new Order({
      userId,
      name,
      email,
      phone,
      address,
      paymentMethod,
      items,
      totalAmount,
      placedAt,
      status: 'pending'
    });

    await newOrder.save();

    res.status(201).json({ success: true, orderId: newOrder._id });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};


exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found' });
    }

    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
