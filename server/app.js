require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Importing routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');       // Add event routes
const attendanceRoutes = require('./routes/AttendanceRoutes');// Add attendance routes
const feedbackRoutes = require('./routes/feedbackRoutes');     // Add feedback routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if unable to connect
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Route middlewares
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);          // Use event routes
app.use('/api/attendance', attendanceRoutes);// Use attendance routes
app.use('/api/feedback', feedbackRoutes);      // Use feedback routes

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
