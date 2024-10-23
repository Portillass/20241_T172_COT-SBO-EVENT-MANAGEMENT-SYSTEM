const express = require('express');
const SBOOfficer = require('../models/SBO_fficer');

const router = express.Router();

// Add a new event (SBO Officer only)
router.post('/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all events (SBO Officer can view and manage)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ... (Implement other SBO Officer routes)

module.exports = router;