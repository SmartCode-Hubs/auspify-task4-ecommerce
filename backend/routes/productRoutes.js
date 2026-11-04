const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// PUBLIC: Get all products (NO protect middleware here)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC: Seed database
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones.', price: 85000, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'Electronics', countInStock: 10 },
      { name: 'Minimalist Watch', description: 'Classic leather strap watch.', price: 45000, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Accessories', countInStock: 5 },
      { name: 'Smart Backpack', description: 'Water-resistant backpack with USB port.', price: 35000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'Accessories', countInStock: 15 },
      { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard.', price: 65000, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', category: 'Electronics', countInStock: 8 }
    ];
    await Product.insertMany(products);
    res.json({ message: 'Database seeded!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Update Product
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN ONLY: Create Product
// ADMIN ONLY: Create Product
router.post('/', protect, admin, async (req, res) => {
  try {
    console.log("Incoming Product Data:", req.body); // <-- Watch your backend terminal for this!

    const { name, price, image, category, countInStock, description } = req.body;
    
    if (!name || !price || !image || !category || !countInStock || !description) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const newProduct = new Product({
      name, 
      price: Number(price), 
      image, 
      category, 
      countInStock: Number(countInStock), 
      description
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) { 
    console.error("Product Save Error:", err); // <-- Watch your backend terminal for this!
    res.status(500).json({ error: err.message }); 
  }
});
// ADMIN ONLY: Delete Product
router.delete('/:id', protect, admin, async (req, res) => {
  // ... keep existing code ...
});

module.exports = router;