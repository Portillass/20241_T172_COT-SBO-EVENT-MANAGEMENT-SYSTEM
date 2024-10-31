const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_id: String,
  title: String,
  description: String,
  date: Date,
  location: String,
  organizer_id: String,
  status: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
