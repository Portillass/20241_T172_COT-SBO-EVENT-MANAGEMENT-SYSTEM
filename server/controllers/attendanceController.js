const Attendance = require('../models/attendanceModel');


// Get all attendance records
exports.getAllAttendanceRecords = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an attendance record by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new attendance record
exports.createAttendance = async (req, res) => {
  const attendance = new Attendance(req.body);
  try {
    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an attendance record by ID
exports.updateAttendance = async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // runValidators ensures that schema validation is applied on updates
    );
    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an attendance record by ID
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: "Attendance record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
