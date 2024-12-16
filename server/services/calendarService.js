const { google } = require('googleapis');
const { OAuth2 } = google.auth;

class CalendarService {
  constructor() {
    this.oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  async listEvents(timeMin = new Date().toISOString()) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return { success: true, events: response.data.items };
    } catch (error) {
      console.error('Error listing events:', error);
      return { success: false, message: 'Failed to fetch events' };
    }
  }

  async createEvent(eventData) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      
      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'Asia/Manila',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'Asia/Manila',
        },
        location: eventData.location,
        attendees: eventData.attendees || [],
        reminders: {
          useDefault: true
        }
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return {
        success: true,
        event: response.data
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return {
        success: false,
        message: 'Failed to create event'
      };
    }
  }

  async updateEvent(eventId, eventData) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      
      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'Asia/Manila',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'Asia/Manila',
        },
        location: eventData.location,
        attendees: eventData.attendees || [],
        reminders: {
          useDefault: true
        }
      };

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
      });

      return {
        success: true,
        event: response.data
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return {
        success: false,
        message: 'Failed to update event'
      };
    }
  }

  async deleteEvent(eventId) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      return {
        success: true,
        message: 'Event deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        message: 'Failed to delete event'
      };
    }
  }

  async getEvent(eventId) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      
      const response = await calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });

      return {
        success: true,
        event: response.data
      };
    } catch (error) {
      console.error('Error getting event:', error);
      return {
        success: false,
        message: 'Failed to get event'
      };
    }
  }

  async getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    return url;
  }

  async getTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return { success: true, tokens };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return { success: false, message: 'Failed to get tokens' };
    }
  }
}

module.exports = new CalendarService();
