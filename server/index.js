<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const googleApiRoutes = require('./routes/googleApi');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/google', googleApiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
=======
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./model/Users"); // Users model
const EventModel = require("./model/Event"); // Event model
const StudentModel = require("./model/Student"); // Student model

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://2201107699:12345@database.ohnnm.mongodb.net/?retryWrites=true&w=majority&appName=Database");

// User routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("The password is incorrect");
        }
      } else {
        res.json("No record existed");
      }
    })
    .catch(err => res.json(err));
});

app.post("/register", (req, res) => {
  UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

// Event Routes
app.get("/events", (req, res) => {
  EventModel.find()
    .then(events => res.json(events))
    .catch(err => res.json(err));
});

app.get("/events/:id", (req, res) => {
  const { id } = req.params;
  EventModel.findById(id)
    .then(event => {
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    })
    .catch(err => res.status(500).json({ error: 'Error fetching event' }));
});

app.post("/events", (req, res) => {
  EventModel.create(req.body)
    .then(event => res.json(event))
    .catch(err => res.json(err));
});

app.put("/events/:id", (req, res) => {
  const { id } = req.params;
  const { name, theme, date, time, address } = req.body;

  if (!name || !theme || !date || !time || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  EventModel.findByIdAndUpdate(id, { name, theme, date, time, address }, { new: true })
    .then(updatedEvent => res.json(updatedEvent))
    .catch(err => res.status(500).json({ error: 'Failed to update event' }));
});

app.delete("/events/:id", (req, res) => {
  const { id } = req.params;
  EventModel.findByIdAndDelete(id)
    .then(() => res.json("Event deleted"))
    .catch(err => res.json(err));
});

// Student Routes

// Add a new student
app.post("/students", (req, res) => {
  const { firstName, lastName, studentID, course } = req.body;

  if (!firstName || !lastName || !studentID || !course) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  StudentModel.findOne({ studentID })
    .then(existingStudent => {
      if (existingStudent) {
        return res.status(400).json({ error: 'Student with this ID already exists' });
      }

      StudentModel.create({ firstName, lastName, studentID, course })
        .then(student => res.json(student))
        .catch(err => res.status(500).json({ error: 'Failed to add student' }));
    })
    .catch(err => res.status(500).json({ error: 'Error checking student' }));
});

// Fetch all students
app.get("/students", (req, res) => {
  StudentModel.find()
    .then(students => res.json(students))
    .catch(err => res.status(500).json({ error: 'Failed to fetch students' }));
});

// Get student by ID
app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  StudentModel.findById(id)
    .then(student => {
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json(student);
    })
    .catch(err => res.status(500).json({ error: 'Failed to fetch student' }));
});

// Update a student
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, studentID, course } = req.body;

  if (!firstName || !lastName || !studentID || !course) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  StudentModel.findByIdAndUpdate(id, { firstName, lastName, studentID, course }, { new: true })
    .then(updatedStudent => {
      if (!updatedStudent) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json(updatedStudent);
    })
    .catch(err => res.status(500).json({ error: 'Failed to update student' }));
});

// Delete a student
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  StudentModel.findByIdAndDelete(id)
    .then(deletedStudent => {
      if (!deletedStudent) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json("Student deleted");
    })
    .catch(err => res.status(500).json({ error: 'Failed to delete student' }));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
>>>>>>> QA
});
