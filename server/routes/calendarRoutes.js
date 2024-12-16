const express = require('express');
const router = express.Router();
const calendarService = require('../services/calendarService');
const { authenticateToken } = require('../middleware/auth');

// Get auth URL for Google Calendar
router.get('/auth-url', async (req, res) => {
  try {
    const url = await calendarService.getAuthUrl();
    res.json({ success: true, url });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ success: false, message: 'Failed to get auth URL' });
  }
});

// Handle OAuth callback
router.post('/oauth-callback', async (req, res) => {
  try {
    const { code } = req.body;
    const result = await calendarService.getTokens(code);
    if (result.success) {
      res.json({ success: true, tokens: result.tokens });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ success: false, message: 'Failed to process OAuth callback' });
  }
});

// List events
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const result = await calendarService.listEvents();
    if (result.success) {
      res.json({ success: true, events: result.events });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error listing events:', error);
    res.status(500).json({ success: false, message: 'Failed to list events' });
  }
});

// Get single event
router.get('/events/:eventId', authenticateToken, async (req, res) => {
  try {
    const result = await calendarService.getEvent(req.params.eventId);
    if (result.success) {
      res.json({ success: true, event: result.event });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({ success: false, message: 'Failed to get event' });
  }
});

// Create event
router.post('/events', authenticateToken, async (req, res) => {
  try {
    const result = await calendarService.createEvent(req.body);
    if (result.success) {
      res.json({ success: true, event: result.event });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
});

// Update event
router.put('/events/:eventId', authenticateToken, async (req, res) => {
  try {
    const result = await calendarService.updateEvent(req.params.eventId, req.body);
    if (result.success) {
      res.json({ success: true, event: result.event });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

// Delete event
router.delete('/events/:eventId', authenticateToken, async (req, res) => {
  try {
    const result = await calendarService.deleteEvent(req.params.eventId);
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
});

module.exports = router;
