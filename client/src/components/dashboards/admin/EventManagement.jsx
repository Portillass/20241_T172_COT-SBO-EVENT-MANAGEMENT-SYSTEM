import { useState, useEffect } from 'react';
import { Card, Button, Badge, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlus } from 'react-icons/fa';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

function EventManagement() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    location: '',
    startDateTime: '',
    endDateTime: '',
    attendees: []
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/calendar/events');
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...formData,
        attendees: [{ email: user.email }], // Add current user as an attendee
        organizer: user.email // Add current user as organizer
      };

      if (selectedEvent) {
        // Update existing event
        const response = await axios.put(`/api/v1/calendar/events/${selectedEvent.id}`, eventData);
        if (response.data.success) {
          toast.success('Event updated successfully');
          fetchEvents();
        }
      } else {
        // Create new event
        const response = await axios.post('/api/v1/calendar/events', eventData);
        if (response.data.success) {
          toast.success('Event created successfully');
          fetchEvents();
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedEvent) return;

      const response = await axios.delete(`/api/v1/calendar/events/${selectedEvent.id}`);
      if (response.data.success) {
        toast.success('Event deleted successfully');
        fetchEvents();
        setShowDeleteModal(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      summary: '',
      description: '',
      location: '',
      startDateTime: '',
      endDateTime: '',
      attendees: []
    });
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      summary: event.summary || '',
      description: event.description || '',
      location: event.location || '',
      startDateTime: event.start?.dateTime || '',
      endDateTime: event.end?.dateTime || '',
      attendees: event.attendees || []
    });
    setShowModal(true);
  };

  const handleShowDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Event Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Create Event
        </Button>
      </div>

      <Row>
        {events.map((event) => (
          <Col key={event.id} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{event.summary}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <div className="mb-2">
                  <FaCalendarAlt className="me-2" />
                  {new Date(event.start.dateTime).toLocaleString()}
                </div>
                {event.location && (
                  <div className="mb-2">
                    <FaMapMarkerAlt className="me-2" />
                    {event.location}
                  </div>
                )}
                {event.attendees && (
                  <div className="mb-2">
                    <FaUsers className="me-2" />
                    {event.attendees.length} attendees
                  </div>
                )}
                <div className="mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleShowDeleteModal(event)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create/Edit Event Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Edit Event' : 'Create Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedEvent ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this event?
          {selectedEvent && <p className="fw-bold mt-2">{selectedEvent.summary}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EventManagement;