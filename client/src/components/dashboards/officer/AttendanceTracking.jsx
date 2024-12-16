import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const API_URL = 'http://localhost:5000/api/attendance'; // Update with your server URL

function AttendanceTracking() {
  const [attendeeName, setAttendeeName] = React.useState('');
  const [attendees, setAttendees] = React.useState([]);

  const addAttendee = () => {
    if (attendeeName) {
      const attendee = { name: attendeeName, status: 'Present' };
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendee),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Attendance recorded: ', data);
        setAttendees([...attendees, attendee]);
        setAttendeeName('');
      })
      .catch(error => console.error('Error recording attendance:', error));
    }
  };

  return (
    <div>
      <h2>Attendance Tracking</h2>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group controlId="formAttendeeName">
              <Form.Label>Attendee Name</Form.Label>
              <Form.Control 
                type="text" 
                value={attendeeName} 
                onChange={(e) => setAttendeeName(e.target.value)} 
              />
            </Form.Group>
            <Button variant="primary" onClick={addAttendee}>Add Attendee</Button>
          </Form>
          <ul>
            {attendees.map((attendee, index) => (
              <li key={index}>{attendee.name} - {attendee.status}</li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AttendanceTracking; 