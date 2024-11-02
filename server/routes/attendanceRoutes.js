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
router.get('/', getAllAttendanceRecords);
router.get('/:id', getAttendanceById); 
router.post('/', createAttendance); 
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance); // Delete an attendance record by ID

module.exports = router;
