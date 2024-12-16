const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// Google Calendar API setup
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const SERVICE_ACCOUNT_FILE = 'C:/lastnani/server/package.json'; // Update with your actual path

const credentials = require(SERVICE_ACCOUNT_FILE);
const client = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key, 
  SCOPES
);

const calendar = google.calendar({ version: 'v3', auth: client });

// Create an event
router.post('/', async (req, res) => {
  const event = {
    summary: req.body.summary,
    description: req.body.description,
    start: {
      dateTime: req.body.start.dateTime,
      timeZone: 'America/Los_Angeles', // Update with your timezone
    },
    end: {
      dateTime: req.body.end.dateTime,
      timeZone: 'America/Los_Angeles', // Update with your timezone
    },
  };

  try {
    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    res.status(201).json({ message: 'Event created', event: createdEvent.data });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Edit an event
router.put('/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  const event = {
    summary: req.body.summary,
    description: req.body.description,
    start: {
      dateTime: req.body.start.dateTime,
      timeZone: 'America/Los_Angeles', // Update with your timezone
    },
    end: {
      dateTime: req.body.end.dateTime,
      timeZone: 'America/Los_Angeles', // Update with your timezone
    },
  };

  try {
    const updatedEvent = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: event,
    });
    res.status(200).json({ message: 'Event updated', event: updatedEvent.data });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete an event
router.delete('/:eventId', async (req, res) => {
  const eventId = req.params.eventId;

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router; 