const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Windows DNS Fix

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- Imported correctly here

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes); // <-- THIS WAS MISSING! Now the profile route works

app.get('/', (req, res) => res.status(200).json({ message: 'E-Commerce API running' }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Database] MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
  } catch (err) {
    console.error('[Database] Connection Error:', err.message);
    process.exit(1);
  }
};
startServer();