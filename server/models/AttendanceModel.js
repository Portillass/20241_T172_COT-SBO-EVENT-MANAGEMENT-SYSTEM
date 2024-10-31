const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendance_date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
