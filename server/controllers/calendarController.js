const calendarService = require('../services/calendarService');

const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const event = await calendarService.createCalendarEvent(eventData);
    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error('Error in createEvent controller:', error);
    res.status(500).json({ success: false, message: 'Error creating event', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = req.body;
    const event = await calendarService.updateCalendarEvent(eventId, eventData);
    res.json({ success: true, event });
  } catch (error) {
    console.error('Error in updateEvent controller:', error);
    res.status(500).json({ success: false, message: 'Error updating event', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    await calendarService.deleteCalendarEvent(eventId);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error in deleteEvent controller:', error);
    res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
  }
};

const listEvents = async (req, res) => {
  try {
    const events = await calendarService.listCalendarEvents();
    res.json({ success: true, events });
  } catch (error) {
    console.error('Error in listEvents controller:', error);
    res.status(500).json({ success: false, message: 'Error listing events', error: error.message });
  }
};

// Test Google Calendar API connection
const testConnection = async (req, res) => {
  try {
    const result = await calendarService.testConnection();
    res.json(result);
  } catch (error) {
    console.error('Error testing calendar connection:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get OAuth2 URL for authorization
const getAuthUrl = async (req, res) => {
  try {
    const url = await calendarService.authorize();
    res.json({ success: true, url });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Handle OAuth2 callback
const handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await calendarService.setCredentials(code);
    res.redirect(`${process.env.CLIENT_URL}/dashboard/officer?success=true`);
  } catch (error) {
    console.error('Error handling callback:', error);
    res.redirect(`${process.env.CLIENT_URL}/dashboard/officer?error=${encodeURIComponent(error.message)}`);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  testConnection,
  getAuthUrl,
  handleCallback,
};
