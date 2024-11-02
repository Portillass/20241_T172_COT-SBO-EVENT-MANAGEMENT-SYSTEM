const mongoose = require('mongoose');

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['attending', 'not attending'],
    default: 'attending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const attendance = mongoose.model('attendance', attendanceSchema,'attendanceModel');

// Export the model
module.exports = attendance;
