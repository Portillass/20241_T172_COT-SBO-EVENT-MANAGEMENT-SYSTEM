const express = require('express');
const Event = require('../models/eventModel');

const router = express.Router();

// POST route to create a new event
router.post('/', async (req, res) => {
  const { event_id, title, description, date, location, organizer_id, status } = req.body;

  // Validate required fields
  if (!event_id || !title || !date || !location || !organizer_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newEvent = new Event({
      event_id,
      title,
      description,
      date,
      location,
      organizer_id,
      status,
    });
    
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error });
  }
});

// GET route to fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

module.exports = router;
