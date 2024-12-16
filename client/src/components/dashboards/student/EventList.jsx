import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import axios from '../../../utils/axios';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/events/upcoming');
        setEvents(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch events. Please try again later.');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (events.length === 0) {
    return (
      <Alert variant="info">
        No upcoming events at the moment.
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Upcoming Events</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {events.map((event) => (
          <Col key={event._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="mb-3">{event.title}</Card.Title>
                <Card.Text>
                  <div className="mb-2">
                    <FaCalendar className="me-2 text-primary" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="mb-2">
                    <FaClock className="me-2 text-primary" />
                    {event.time}
                  </div>
                  <div>
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    {event.location}
                  </div>
                </Card.Text>
                {event.description && (
                  <Card.Text className="text-muted mt-2">
                    {event.description}
                  </Card.Text>
                )}
              </Card.Body>
              <Card.Footer className="bg-light">
                <small className="text-muted">
                  Organized by: {event.organizer || 'WMSU-CSSO'}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default EventList;
