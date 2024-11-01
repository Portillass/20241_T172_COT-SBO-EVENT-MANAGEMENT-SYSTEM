const express = require('express');
const {
  getAllAttendanceRecords,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');

const router = express.Router();

// Define the routes
router.get('/', getAllAttendanceRecords); // GET all attendance records
router.get('/:id', getAttendanceById); // GET attendance record by ID
router.post('/', createAttendance); // Create a new attendance record
router.put('/:id', updateAttendance); // Update an attendance record by ID
router.delete('/:id', deleteAttendance); // Delete an attendance record by ID

module.exports = router;
