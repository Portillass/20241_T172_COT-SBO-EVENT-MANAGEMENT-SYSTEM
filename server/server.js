require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const net = require('net');

const app = express();

// Connect to Database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Security Middleware
securityMiddleware(app);

// Regular Middleware
app.use(cors());
app.use(express.json());

// Import Google Auth Routes
const googleAuthRoutes = require('./routes/googleAuthRoutes');

// Use Google Auth Routes
app.use('/api/v1/auth', googleAuthRoutes);

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/events', require('./routes/events'));
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/calendar', require('./routes/calendar'));
app.use('/api/v1/users', require('./routes/users'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Function to find an available port
function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => {
        resolve(port);
      });
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// Start Server
async function startServer() {
  try {
    const PORT = await findAvailablePort(process.env.PORT || 5003);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;