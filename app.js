const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const rateLimit = require('express-rate-limit');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const dealRoutes = require('./routes/dealRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();


const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 minutes in milliseconds
  max: 100,                 // max 100 requests per IP in 5 minutes
  message: { 
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

// DB Connection
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '1gb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1gb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is working fine!' });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentLimiter, paymentRoutes);
app.use('/api/deals', dealRoutes);

module.exports = app;
