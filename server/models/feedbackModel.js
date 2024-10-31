const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedback_id: String,
  event_id: String,
  user_id: String,
  rating: Number,
  comments: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
    