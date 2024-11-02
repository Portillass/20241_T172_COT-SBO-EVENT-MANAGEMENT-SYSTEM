require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Importing routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');       
const attendanceRoutes = require('./routes/AttendanceRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');     
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
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('MongoDB connected successfully.');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//     process.exit(1); // Exit if unable to connect
//   });

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Route middlewares
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);          
app.use('/api/attendance', attendanceRoutes);
app.use('/api/feedback', feedbackRoutes);     

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//mongodb compass
//MONGODB_URI=mongodb://localhost:27017/school
