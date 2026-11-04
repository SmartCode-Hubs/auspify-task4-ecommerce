const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// IMPORT THE NEW MIDDLEWARE
const { protect, admin } = require('../middleware/authMiddleware');

// Get user profile (Logged in user)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, phone, address, notifications } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address, notifications },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update user password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN: Get all users (For the Customer Directory)
// THIS WAS CAUSING THE ERROR - Changed verifyToken to protect, admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;