import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="dashboard-nav">
      <Container>
        <Navbar.Brand href={`/dashboard/${user?.role}`}>
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="dashboard-navbar" />
        <Navbar.Collapse id="dashboard-navbar">
          <Nav className="me-auto">
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            {user?.role === 'admin' && (
              <>
                <Nav.Link href="#users">Users</Nav.Link>
                <Nav.Link href="#settings">Settings</Nav.Link>
              </>
            )}
            {user?.role === 'officer' && (
              <>
                <Nav.Link href="#events">Events</Nav.Link>
                <Nav.Link href="#reports">Reports</Nav.Link>
              </>
            )}
            {user?.role === 'student' && (
              <>
                <Nav.Link href="#my-events">My Events</Nav.Link>
                <Nav.Link href="#calendar">Calendar</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                {user?.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DashboardHeader; 