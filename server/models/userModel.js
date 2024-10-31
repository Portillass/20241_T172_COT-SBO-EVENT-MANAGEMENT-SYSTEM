const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  email: String,
  role: String,
  password_hash: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
