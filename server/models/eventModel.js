const mongoose = require('mongoose');

// Define the event schema
const eventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
    unique: true, // Ensures each event_id is unique
  },
  title: {
    type: String,
    required: true, // Title of the event is required
  },
  description: {
    type: String, // Description is optional
  },
  date: {
    type: Date,
    required: true, // Date of the event is required
  },
  location: {
    type: String,
    required: true, // Location is required
  },
  organizer_id: {
    type: String,
    required: true, // ID of the user organizing the event
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'canceled'], // Status can only be one of these values
    default: 'upcoming', // Default status is 'upcoming'
  },
  created_at: {
    type: Date,
    default: Date.now, // Default to the current date and time
  },
});

// Create the event model
module.exports = mongoose.model('eventModel', eventSchema);
