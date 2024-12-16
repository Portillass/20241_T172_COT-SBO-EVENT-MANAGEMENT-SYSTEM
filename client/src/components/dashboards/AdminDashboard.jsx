import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import UserManagement from './admin/UserManagement';
import EventManagement from './admin/EventManagement';
import Reports from './admin/Reports';
import axios from '../../utils/axios';
import logo from '../../assets/logo.png';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          {/* Header with User Info */}
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
                <h1 className="moving-text">Welcome to the Admin Dashboard</h1>
              </div>
            </Col>
          </Row>

          {/* Main Content */}
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Row>
              <Col md={3} lg={2}>
                <Nav variant="pills" className="flex-column dashboard-nav-pills">
                  <Nav.Item>
                    <Nav.Link eventKey="users">
                      <FaUsers className="me-2" />
                      User Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="events">
                      <FaCalendarAlt className="me-2" />
                      Event Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="reports">
                      <FaChartBar className="me-2" />
                      Reports & Analytics
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9} lg={10}>
                <Tab.Content>
                  <Tab.Pane eventKey="users">
                    <UserManagement onUserUpdate={() => {}} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="events">
                    <EventManagement onEventUpdate={() => {}} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="reports">
                    <Reports />
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

export default AdminDashboard;