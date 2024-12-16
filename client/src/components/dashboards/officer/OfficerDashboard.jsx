import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Nav, Tab, Dropdown, Spinner } from 'react-bootstrap';
import { useCalendar } from '../../../context/CalendarContext';
import EventManagement from './EventManagement';
import QRCodeGenerator from './QRCodeGenerator';
import AttendanceTracker from './AttendanceTracker';
import EventReports from './EventReports';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCalendar, 
  FaUser, 
  FaSignOutAlt, 
  FaCog, 
  FaCalendarPlus, 
  FaUsers, 
  FaChartBar,
  FaQrcode,
  FaUserCheck,
  FaGoogle
} from 'react-icons/fa';
import logo from '../../../assets/logo.png';
import '../AdminDashboard.css';

function OfficerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Google API Integration States
  const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);
  const [googleServices, setGoogleServices] = useState({
    calendar: false,
    analytics: false
  });
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalParticipants: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    // Check for Google auth state from previous redirect
    const googleAuthState = location.state?.googleAuthSuccess || location.state?.googleAuthError;
    if (googleAuthState) {
      googleAuthState.includes('Successfully') 
        ? setSuccessMessage(googleAuthState)
        : setError(googleAuthState);
      
      // Clear the state to prevent repeated messages
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const loadGoogleApiClient = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', initializeGoogleApi);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    const initializeGoogleApi = async () => {
      try {
        await window.gapi.client.init({
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: [
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/analytics.readonly'
          ].join(' ')
        });

        const authInstance = window.gapi.auth2.getAuthInstance();
        const isSignedIn = authInstance.isSignedIn.get();
        setIsGoogleAuthorized(isSignedIn);

        // Load required APIs
        await Promise.all([
          window.gapi.client.load('calendar', 'v3'),
          window.gapi.client.load('analytics', 'v3')
        ]);

        // Check service availability
        const services = {
          calendar: isSignedIn && await checkServiceAvailability('calendar'),
          analytics: isSignedIn && await checkServiceAvailability('analytics')
        };
        setGoogleServices(services);

        // Fetch dashboard analytics if authorized
        if (services.analytics) {
          await fetchDashboardAnalytics();
        }
      } catch (error) {
        console.error('Google API initialization error:', error);
        setError('Failed to initialize Google services: ' + error.message);
      }
    };

    loadGoogleApiClient();
  }, []);

  const checkServiceAvailability = async (serviceName) => {
    try {
      switch(serviceName) {
        case 'calendar':
          await window.gapi.client.calendar.events.list({ calendarId: 'primary', maxResults: 1 });
          return true;
        case 'analytics':
          await window.gapi.client.analytics.management.accountSummaries.list();
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error(`${serviceName} service check failed:`, error);
      return false;
    }
  };

  const handleCalendarAuthorize = async () => {
    // Construct the authorization URL with all required parameters
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', 'http://localhost:5173/oauth2callback');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar'
    ].join(' '));
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    // Optional: Add state parameter for CSRF protection
    const state = btoa(JSON.stringify({
      timestamp: Date.now(),
      path: window.location.pathname
    }));
    authUrl.searchParams.set('state', state);

    // Redirect to Google OAuth
    window.location.href = authUrl.toString();
  };

  const handleGoogleSignOut = async () => {
    try {
      // Clear local storage tokens
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');

      // If using gapi, sign out
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
      }

      // Reset states
      setIsGoogleAuthorized(false);
      setGoogleServices({ calendar: false, analytics: false });
      setSuccessMessage('Successfully disconnected from Google services');
    } catch (error) {
      console.error('Google sign-out error:', error);
      setError('Failed to sign out from Google: ' + error.message);
    }
  };

  const fetchDashboardAnalytics = async () => {
    try {
      // Fetch event and attendance analytics
      const analyticsResponse = await window.gapi.client.analytics.data.ga.get({
        'ids': 'ga:YOUR_VIEW_ID', // Replace with actual Google Analytics View ID
        'start-date': '30daysAgo',
        'end-date': 'today',
        'metrics': 'ga:totalEvents,ga:uniqueEvents,ga:eventValue',
        'dimensions': 'ga:eventCategory'
      });

      const stats = analyticsResponse.result.rows.reduce((acc, row) => {
        acc.totalEvents += parseInt(row[1]);
        acc.totalParticipants += parseInt(row[2]);
        return acc;
      }, {
        totalEvents: 0,
        totalParticipants: 0,
        attendanceRate: 0
      });

      setDashboardStats(stats);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await window.gapi.auth2.getAuthInstance().signIn();
    } catch (error) {
      setError('Google sign-in failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const testCalendarConnection = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/google/test`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setShowCalendar(true);
        setSuccessMessage('Successfully connected to Google Calendar');
      } else {
        setError(data.message || 'Failed to connect to Google Calendar');
      }
    } catch (error) {
      setError('Error testing calendar connection');
      console.error('Calendar test error:', error);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    // Optionally switch to QR code or attendance tab when an event is selected
    if (!activeTab.startsWith('event')) {
      setActiveTab('events');
    }
  };

  useEffect(() => {
    testCalendarConnection();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error')) {
      setError(decodeURIComponent(params.get('error')));
    }
    if (params.get('success')) {
      setSuccessMessage('Successfully connected to Google Calendar!');
      testCalendarConnection();
    }
    // Clean up URL parameters
    if (location.search) {
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const authStatus = searchParams.get('auth');
    const errorMessage = searchParams.get('message');

    if (authStatus === 'success') {
      setSuccessMessage('Successfully connected to Google Calendar!');
      setShowCalendar(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'error') {
      setError(errorMessage || 'Failed to connect to Google Calendar');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const stats = [
    {
      title: 'Total Events',
      count: '12',
      icon: <FaCalendar />,
      color: 'primary'
    },
    {
      title: 'Upcoming Events',
      count: '5',
      icon: <FaCalendarPlus />,
      color: 'success'
    },
    {
      title: 'Event Participants',
      count: '89',
      icon: <FaUsers />,
      color: 'info'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-content">
        <Container fluid>
          {/* Header with Logo and User Info */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div className="logo-wrapper">
                  <img src={logo} alt="WMSU-CSSO Logo" className="dashboard-logo" />
                </div>
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="user-dropdown">
                    Welcome, {user?.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>

          {/* Welcome Message */}
          <Row className="mb-4">
            <Col>
              <div className="welcome-banner text-center">
                <h1 className="moving-text">Welcome to Officer Dashboard</h1>
              </div>
            </Col>
          </Row>

          {/* Stats Row */}
          <Row className="g-3 mb-4">
            {stats.map((stat, index) => (
              <Col md={4} key={index}>
                <Card className="dashboard-card">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div className={`stats-icon bg-${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0">{stat.title}</h6>
                        <h3 className="mb-0">{stat.count}</h3>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}

          {/* Main Content */}
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Row>
              <Col md={3} lg={2}>
                <Nav variant="pills" className="flex-column dashboard-nav-pills">
                  <Nav.Item>
                    <Nav.Link eventKey="events">
                      <FaCalendar className="me-2" />
                      Event Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="qr">
                      <FaQrcode className="me-2" />
                      QR Code Generator
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="attendance">
                      <FaUserCheck className="me-2" />
                      Attendance Tracker
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="reports">
                      <FaChartBar className="me-2" />
                      Reports
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9} lg={10}>
                <Tab.Content>
                  <Tab.Pane eventKey="events">
                    {!showCalendar ? (
                      <div className="text-center py-5">
                        <img
                          src="https://via.placeholder.com/150"
                          alt="Calendar"
                          className="mb-4"
                          style={{ width: '150px', opacity: '0.5' }}
                        />
                        <p className="mb-4">Connect your Google Calendar to manage events</p>
                        <Button 
                          variant="primary" 
                          size="lg"
                          onClick={handleCalendarAuthorize}
                          className="px-4"
                        >
                          <FaCalendarPlus className="me-2" />
                          Connect Google Calendar
                        </Button>
                      </div>
                    ) : (
                      <EventManagement onEventSelect={handleEventSelect} />
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="qr">
                    {selectedEvent ? (
                      <QRCodeGenerator event={selectedEvent} />
                    ) : (
                      <Card className="text-center p-5">
                        <Card.Body>
                          <h4>No Event Selected</h4>
                          <p>Please select an event from the Event Management tab to generate a QR code.</p>
                        </Card.Body>
                      </Card>
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="attendance">
                    {selectedEvent ? (
                      <AttendanceTracker event={selectedEvent} />
                    ) : (
                      <Card className="text-center p-5">
                        <Card.Body>
                          <h4>No Event Selected</h4>
                          <p>Please select an event from the Event Management tab to track attendance.</p>
                        </Card.Body>
                      </Card>
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="reports">
                    <EventReports />
                  </Tab.Pane>
                  <Tab.Pane eventKey="google">
                    {isGoogleAuthorized ? (
                      <div>
                        <h2>Google Integration</h2>
                        <p>Authorized services:</p>
                        <ul>
                          {googleServices.calendar && <li>Google Calendar</li>}
                          {googleServices.analytics && <li>Google Analytics</li>}
                        </ul>
                        <Button variant="danger" onClick={handleGoogleSignOut}>
                          Sign out from Google
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h2>Google Integration</h2>
                        <p>Please authorize Google services to access your data.</p>
                        <Button variant="primary" onClick={handleGoogleSignIn}>
                          Sign in with Google
                        </Button>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </div>
    </div>
  );
}

export default OfficerDashboard;
