require('dotenv').config();
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials (you'll need to get these first through OAuth flow)
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const sampleEvents = [
  {
    summary: 'Tech Conference 2024',
    description: 'Annual technology conference featuring the latest innovations',
    location: 'Main Auditorium, BukSU Campus',
    start: {
      dateTime: '2024-12-20T09:00:00+08:00',
      timeZone: 'Asia/Manila',
    },
    end: {
      dateTime: '2024-12-20T17:00:00+08:00',
      timeZone: 'Asia/Manila',
    },
    attendees: [
      { email: process.env.ADMIN_EMAIL }
    ],
    reminders: {
      useDefault: true
    }
  },
  {
    summary: 'Student Workshop: Web Development',
    description: 'Hands-on workshop on modern web development techniques',
    location: 'Room 301, Computer Science Building',
    start: {
      dateTime: '2024-12-22T13:00:00+08:00',
      timeZone: 'Asia/Manila',
    },
    end: {
      dateTime: '2024-12-22T16:00:00+08:00',
      timeZone: 'Asia/Manila',
    },
    attendees: [
      { email: process.env.ADMIN_EMAIL }
    ],
    reminders: {
      useDefault: true
    }
  },
  {
    summary: 'Career Fair 2024',
    description: 'Annual career fair with top companies',
    location: 'University Gymnasium',
    start: {
      dateTime: '2024-12-25T10:00:00+08:00',
      timeZone: 'Asia/Manila',
    },
    end: {
      dateTime: '2024-12-25T18:00:00+08:00',
      timeZone: 'Asia/Manila',
    },
    attendees: [
      { email: process.env.ADMIN_EMAIL }
    ],
    reminders: {
      useDefault: true
    }
  }
];

async function seedEvents() {
  try {
    console.log('Starting to seed events...');

    for (const event of sampleEvents) {
      try {
        const response = await calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        });
        console.log('Created event:', response.data.summary);
      } catch (error) {
        console.error('Error creating event:', event.summary, error.message);
      }
    }

    console.log('Finished seeding events');
  } catch (error) {
    console.error('Error in seed script:', error);
  }
}

seedEvents();
