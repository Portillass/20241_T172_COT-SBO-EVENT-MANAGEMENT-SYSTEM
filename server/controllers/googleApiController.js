const { 
  createCalendarEvent, 
  sendEmail, 
  getAnalyticsData, 
  createForm 
} = require('../services/googleApi');

// Calendar Controllers
exports.createEvent = async (req, res) => {
  try {
    const { token } = req.user;
    const eventData = {
      summary: req.body.summary,
      description: req.body.description,
      start: {
        dateTime: req.body.startDateTime,
        timeZone: 'Asia/Manila',
      },
      end: {
        dateTime: req.body.endDateTime,
        timeZone: 'Asia/Manila',
      },
      location: req.body.location,
      attendees: req.body.attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const event = await createCalendarEvent(token, eventData);

    // If event is created successfully, send email notification
    if (event && req.body.sendNotification) {
      await sendEmail(token, {
        to: req.body.attendees.map(a => a.email).join(','),
        subject: `New Event: ${event.summary}`,
        body: `
          <h2>Event Details</h2>
          <p><strong>Event:</strong> ${event.summary}</p>
          <p><strong>Date:</strong> ${new Date(event.start.dateTime).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(event.start.dateTime).toLocaleTimeString()} - ${new Date(event.end.dateTime).toLocaleTimeString()}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Description:</strong> ${event.description}</p>
        `
      });
    }

    // If attendance tracking is requested, create a form
    if (event && req.body.trackAttendance) {
      const form = await createForm(token, {
        info: {
          title: `Attendance: ${event.summary}`,
          description: `Please mark your attendance for ${event.summary}`,
          documentTitle: `Attendance Form - ${event.summary}`
        },
        items: [
          {
            title: 'Name',
            questionItem: {
              question: {
                required: true,
                textQuestion: {
                  paragraph: false
                }
              }
            }
          },
          {
            title: 'Student ID',
            questionItem: {
              question: {
                required: true,
                textQuestion: {
                  paragraph: false
                }
              }
            }
          },
          {
            title: 'Attendance Status',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Present' },
                    { value: 'Late' },
                    { value: 'Absent' }
                  ]
                }
              }
            }
          }
        ]
      });

      event.attendanceForm = form;
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gmail Controllers
exports.sendEmailNotification = async (req, res) => {
  try {
    const { token } = req.user;
    const { to, subject, body } = req.body;
    const result = await sendEmail(token, { to, subject, body });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analytics Controllers
exports.getEventAnalytics = async (req, res) => {
  try {
    const { token } = req.user;
    const { viewId } = req.query;
    const startDate = req.query.startDate || '30daysAgo';
    const endDate = req.query.endDate || 'today';
    const metrics = req.query.metrics || 'ga:totalEvents,ga:uniqueEvents';

    const data = await getAnalyticsData(token, {
      viewId,
      startDate,
      endDate,
      metrics
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forms Controllers
exports.createAttendanceForm = async (req, res) => {
  try {
    const { token } = req.user;
    const { eventTitle, eventDate, description } = req.body;
    
    const form = await createForm(token, {
      info: {
        title: `Attendance Form: ${eventTitle}`,
        description: description || `Attendance form for ${eventTitle} on ${eventDate}`,
        documentTitle: `Attendance - ${eventTitle}`
      },
      items: [
        {
          title: 'Name',
          questionItem: {
            question: {
              required: true,
              textQuestion: {
                paragraph: false
              }
            }
          }
        },
        {
          title: 'Student ID',
          questionItem: {
            question: {
              required: true,
              textQuestion: {
                paragraph: false
              }
            }
          }
        },
        {
          title: 'Attendance Status',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: 'Present' },
                  { value: 'Late' },
                  { value: 'Absent' }
                ]
              }
            }
          }
        }
      ]
    });

    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
