const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// IMPORT THE MIDDLEWARE HERE
const { protect, admin } = require('../middleware/authMiddleware');

// --- USER ROUTES ---

// Create Order
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, totalPrice, shippingAddress } = req.body;
    const newOrder = new Order({ user: req.user.id, orderItems, shippingAddress, totalPrice });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get User Orders
router.get('/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// --- ADMIN ROUTES ---

// Get All Orders
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Order Status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Dashboard Stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    const users = await User.countDocuments({});
    const products = await Product.countDocuments({});
    
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    
    const statusCounts = {
      Pending: orders.filter(o => o.status === 'Pending' || !o.status).length,
      Processing: orders.filter(o => o.status === 'Processing').length,
      Shipped: orders.filter(o => o.status === 'Shipped').length,
      Delivered: orders.filter(o => o.status === 'Delivered').length,
    };

    res.json({ totalRevenue, totalOrders: orders.length, totalUsers: users, totalProducts: products, statusCounts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;