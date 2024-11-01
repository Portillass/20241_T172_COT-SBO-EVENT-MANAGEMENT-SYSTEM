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
const FeedbackModel = mongoose.model('feedback', feedbackSchema);

// Export the model
module.exports = FeedbackModel;
