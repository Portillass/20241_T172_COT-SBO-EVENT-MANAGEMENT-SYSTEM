// model/Student.js
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentID: { type: String, required: true, unique: true },
  course: { type: String, required: true },
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
