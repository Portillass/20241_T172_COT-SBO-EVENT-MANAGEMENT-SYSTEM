import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendar,
  FaSignOutAlt,
  FaQrcode,
  FaHistory
} from 'react-icons/fa';
import logo from '../../../assets/logo.png';
import '../AdminDashboard.css';
import EventList from './EventList';
import QRScanner from './QRScanner';
import AttendanceHistory from './AttendanceHistory';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
                <h1 className="moving-text">Welcome to Student Dashboard</h1>
              </div>
            </Col>
          </Row>

          {/* Main Content */}
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Row>
              <Col md={3} lg={2}>
                <Nav variant="pills" className="flex-column dashboard-nav-pills">
                  <Nav.Item>
                    <Nav.Link eventKey="events">
                      <FaCalendar className="me-2" />
                      Events
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="qr">
                      <FaQrcode className="me-2" />
                      QR Scanner
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="history">
                      <FaHistory className="me-2" />
                      Attendance History
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9} lg={10}>
                <Tab.Content>
                  <Tab.Pane eventKey="events">
                    <EventList />
                  </Tab.Pane>
                  <Tab.Pane eventKey="qr">
                    <QRScanner />
                  </Tab.Pane>
                  <Tab.Pane eventKey="history">
                    <AttendanceHistory />
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

export default StudentDashboard;
