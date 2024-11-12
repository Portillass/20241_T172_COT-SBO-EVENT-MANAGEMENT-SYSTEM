const AttendanceModel = require('../models/AttendanceModel'); // Ensure this matches the model file

// Get all attendance records
exports.getAllAttendanceRecords = async (req, res) => {
  try {
    const attendanceRecords = await AttendanceModel.find(); // Use AttendanceModel instead of Attendance
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an attendance record by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await AttendanceModel.findById(req.params.id); // Use AttendanceModel
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
  const attendance = new AttendanceModel(req.body); // Use AttendanceModel
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
    const updatedAttendance = await AttendanceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // runValidators ensures that schema validation is applied on updates
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
    const attendance = await AttendanceModel.findByIdAndDelete(req.params.id); // Use AttendanceModel
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: "Attendance record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
