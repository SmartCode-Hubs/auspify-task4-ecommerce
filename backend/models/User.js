const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  notifications: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);