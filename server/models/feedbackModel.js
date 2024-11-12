const mongoose = require('mongoose');

// Define the feedback schema
const feedbackSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  event_id: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const Feedback = mongoose.model('feedback', feedbackSchema, 'feedback');

// Export the model
module.exports = Feedback;
