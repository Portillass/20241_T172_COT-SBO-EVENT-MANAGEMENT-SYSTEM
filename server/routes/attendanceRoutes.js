const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/checkin', attendanceController.checkIn);
router.get('/:eventId', attendanceController.getAttendance);

module.exports = router;
