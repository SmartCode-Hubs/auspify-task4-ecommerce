const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'auspify_ecommerce_secret';

// 1. AUTHENTICATION: Verify if the user is logged in
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from the database (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // Move to the next step (the actual route)
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// 2. AUTHORIZATION: Verify if the user is an Admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // They are an admin, let them pass
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { protect, admin };