import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaPlus, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

// Google OAuth Configuration
const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: '422420504540-khiasc7hk040g0gdesh11plu9lg94cp8.apps.googleusercontent.com',
  AUTH_BASE_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  REDIRECT_URI: 'https://localhost:5173/oauth2callback',
  SCOPES: [
    'openid',
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' '),
  RESPONSE_TYPE: 'code',
  ACCESS_TYPE: 'offline', 
  PROMPT: 'consent'
};

const EventManagement = ({ onEventSelect }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [googleServices, setGoogleServices] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: ''
  });

  // Enhanced Google Services Initialization
  const initializeGoogleServices = async () => {
    try {
      setIsLoading(true);
      
      // Check if gapi is loaded
      if (typeof window.gapi === 'undefined') {
        throw new Error('Google API Client Library not loaded');
      }

      // Load the client library
      await new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', {
          callback: resolve,
          onerror: reject
        });
      });

      // Initialize the client with your configuration
      await window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Make sure to set this in .env
        clientId: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: GOOGLE_OAUTH_CONFIG.SCOPES
      });

      // Check if the user is already signed in
      const authInstance = window.gapi.auth2.getAuthInstance();
      const isSignedIn = authInstance.isSignedIn.get();

      if (isSignedIn) {
        const googleUser = authInstance.currentUser.get();
        const profile = googleUser.getBasicProfile();
        console.log('Signed in as:', profile.getName());
      }

      setGoogleServices(window.gapi.client);
      setError(null);
    } catch (err) {
      console.error('Google Services Initialization Error:', err);
      setError({
        message: err.message,
        details: err.details || 'Failed to initialize Google services',
        stack: err.stack
      });
      setGoogleServices(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Google API Script Dynamically
  useEffect(() => {
    const loadGoogleAPIScript = () => {
      return new Promise((resolve, reject) => {
        if (document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initServices = async () => {
      try {
        await loadGoogleAPIScript();
        await initializeGoogleServices();
      } catch (err) {
        console.error('Failed to load Google API:', err);
      }
    };

    initServices();
  }, []);

  useEffect(() => {
    const initializeGoogleApi = async () => {
      try {
        // Initialize client
        await window.gapi.client.init({
          clientId: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
          scope: GOOGLE_OAUTH_CONFIG.SCOPES
        });

        // Set up auth listener
        const authInstance = window.gapi.auth2.getAuthInstance();
        setIsGoogleAuthorized(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(updateSigninStatus);

        setGoogleApiLoaded(true);
        
        // Fetch events if already signed in
        if (authInstance.isSignedIn.get()) {
          await fetchEvents();
        }
      } catch (error) {
        console.error('Google API initialization error:', error);
        setError(`Failed to initialize Google services: ${error.message}`);
        setGoogleApiLoaded(false);
      }
    };

    initializeGoogleApi();
  }, []);

  const updateSigninStatus = async (isSignedIn) => {
    setIsGoogleAuthorized(isSignedIn);
    if (isSignedIn) {
      try {
        await fetchEvents();
        setSuccess('Successfully connected to Google Calendar');
      } catch (error) {
        setError(`Failed to fetch events: ${error.message}`);
      }
    } else {
      setEvents([]);
      setSuccess('Disconnected from Google Calendar');
    }
  };

  const handleGoogleSignIn = () => {
    try {
      const { 
        CLIENT_ID, 
        REDIRECT_URI,
        SCOPES, 
        AUTH_BASE_URL, 
        RESPONSE_TYPE, 
        ACCESS_TYPE, 
        PROMPT
      } = GOOGLE_OAUTH_CONFIG;

      // Generate a secure state parameter
      const state = btoa(JSON.stringify({
        timestamp: Date.now(),
        nonce: crypto.randomUUID(), // Use cryptographically secure random UUID
        origin: window.location.origin
      }));

      // Construct query parameters with explicit encoding
      const params = new URLSearchParams({
        client_id: encodeURIComponent(CLIENT_ID),
        redirect_uri: encodeURIComponent(REDIRECT_URI),
        response_type: encodeURIComponent(RESPONSE_TYPE),
        scope: encodeURIComponent(SCOPES),
        access_type: encodeURIComponent(ACCESS_TYPE),
        prompt: encodeURIComponent(PROMPT),
        state: encodeURIComponent(state)
      });

      // Construct full authorization URL
      const authorizationUrl = `${AUTH_BASE_URL}?${params.toString()}`;

      // Detailed logging for debugging
      console.group('🔐 Google OAuth Authorization');
      console.log('Full Authorization URL:', authorizationUrl);
      console.log('Redirect URI:', REDIRECT_URI);
      console.log('Client ID:', CLIENT_ID);
      console.log('Scopes:', SCOPES);
      console.groupEnd();

      // Store state in localStorage for verification
      localStorage.setItem('oauth_state', state);

      // Redirect to Google OAuth
      window.location.href = authorizationUrl;

    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      // User-friendly error handling
      alert(`OAuth Configuration Error:
${error.message}

Troubleshooting:
1. Check internet connection
2. Verify Google Cloud Console settings
3. Ensure correct Client ID and Redirect URI`)
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      
      // Clear stored token
      localStorage.removeItem('google_access_token');
      
      setEvents([]);
      setIsGoogleAuthorized(false);
      setSuccess('Successfully disconnected from Google Calendar');
    } catch (error) {
      console.error('Google sign-out error:', error);
      setError(`Sign-out failed: ${error.message}`);
    }
  };

  const fetchEvents = async () => {
    if (!isGoogleAuthorized) {
      setError('Not authorized. Please sign in to Google Calendar.');
      return;
    }

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const googleEvents = response.result.items.map(event => ({
        id: event.id,
        summary: event.summary,
        description: event.description,
        startDateTime: event.start.dateTime || event.start.date,
        endDateTime: event.end.dateTime || event.end.date,
        location: event.location
      }));

      setEvents(googleEvents);
      setSuccess('Events successfully fetched from Google Calendar');
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
      setError(`Failed to fetch events: ${error.message}`);
    }
  };

  const addEventToGoogleCalendar = async (eventData) => {
    if (!isGoogleAuthorized) {
      setError('Please connect to Google Calendar first');
      return null;
    }

    try {
      const googleEvent = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'Asia/Manila'
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'Asia/Manila'
        },
        location: eventData.location
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: googleEvent
      });

      const newEvent = response.result;
      setSuccess('Event added to Google Calendar');
      return newEvent;
    } catch (error) {
      console.error('Error adding event to Google Calendar:', error);
      setError(`Failed to add event: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let googleEvent = null;
      // Add to Google Calendar if authorized
      if (isGoogleAuthorized) {
        googleEvent = await addEventToGoogleCalendar(formData);
      }

      // Local event management
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/calendar/events`, {
        method: selectedEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          googleEventId: googleEvent?.id
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        await fetchEvents(); // Refresh events
        setSuccess(selectedEvent ? 'Event updated successfully' : 'Event created successfully');
      } else {
        setError(data.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('Event submission error:', error);
      setError(`Failed to save event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      // Delete from Google Calendar if authorized
      if (isGoogleAuthorized && selectedEvent.id) {
        await window.gapi.client.calendar.events.delete({
          calendarId: 'primary',
          eventId: selectedEvent.id
        });
      }

      // Local event deletion
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/calendar/events/${selectedEvent.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setShowDeleteModal(false);
        await fetchEvents(); // Refresh events
        setSuccess('Event deleted successfully');
      } else {
        setError(data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Event deletion error:', error);
      setError(`Failed to delete event: ${error.message}`);
    }
  };

  const columns = [
    {
      name: 'Event Name',
      selector: row => row.summary,
      sortable: true
    },
    {
      name: 'Start Time',
      selector: row => row.startDateTime,
      cell: row => format(new Date(row.startDateTime), 'MMM dd, yyyy HH:mm')
    },
    {
      name: 'End Time',
      selector: row => row.endDateTime,
      cell: row => format(new Date(row.endDateTime), 'MMM dd, yyyy HH:mm')
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setSelectedEvent(row);
              setFormData({
                summary: row.summary,
                description: row.description || '',
                startDateTime: format(new Date(row.startDateTime), "yyyy-MM-dd'T'HH:mm"),
                endDateTime: format(new Date(row.endDateTime), "yyyy-MM-dd'T'HH:mm"),
                location: row.location || ''
              });
              setShowModal(true);
            }}
          >
            <FaEdit /> Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              setSelectedEvent(row);
              setShowDeleteModal(true);
            }}
          >
            <FaTrash /> Delete
          </Button>
        </div>
      )
    }
  ];

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Google Services Initialization Error</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button onClick={initializeGoogleServices}>
          Retry Initialization
        </button>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <p>Initializing Google Services...</p>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Event Management</h2>
            <div className="d-flex gap-2">
              <Button 
                variant={isGoogleAuthorized ? "outline-danger" : "outline-primary"}
                onClick={isGoogleAuthorized ? handleGoogleSignOut : handleGoogleSignIn}
                disabled={!googleApiLoaded}
              >
                <FaGoogle className="me-2" />
                {isGoogleAuthorized ? 'Disconnect Google' : 'Connect Google Calendar'}
              </Button>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" />
                Create Event
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" onClose={() => setSuccess('')} dismissible>
              {success}
            </Alert>
          )}

          <DataTable
            columns={columns}
            data={events}
            pagination
            highlightOnHover
            pointerOnHover
          />

          {/* Create/Edit Event Modal */}
          <Modal show={showModal} onHide={() => { setShowModal(false); setSelectedEvent(null); }}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedEvent ? 'Edit Event' : 'Create New Event'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date and Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="startDateTime"
                        value={formData.startDateTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDateTime: e.target.value }))}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date and Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="endDateTime"
                        value={formData.endDateTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDateTime: e.target.value }))}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner 
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      'Save Event'
                    )}
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
              Are you sure you want to delete "{selectedEvent?.summary}"? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete Event'
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default EventManagement;