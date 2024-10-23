const express = require('express');
const Adviser = require('../models/adviser');

const router = express.Router();

// Add a new SBO Officer
router.post('/sbo-officers', async (req, res) => {
  try {
    const newSBOOfficer = new Adviser(req.body);
    await newSBOOfficer.save();
    res.status(201).json(newSBOOfficer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View Event (Adviser only)
router.get('/events/:eventId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;