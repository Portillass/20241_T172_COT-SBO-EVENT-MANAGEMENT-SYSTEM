import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

function DashboardNav() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="dashboard-nav">
      <Container>
        <Navbar.Brand href={`/dashboard/${user.role}`}>
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="dashboard-nav" />
        <Navbar.Collapse id="dashboard-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Dashboard</Nav.Link>
            {user.role === 'admin' && (
              <Nav.Link href="#users">Users</Nav.Link>
            )}
            {user.role === 'officer' && (
              <Nav.Link href="#events">Events</Nav.Link>
            )}
            {user.role === 'student' && (
              <Nav.Link href="#my-events">My Events</Nav.Link>
            )}
          </Nav>
          <Nav>
            <span className="navbar-text me-3">
              Welcome, {user.name}
            </span>
            <Button 
              variant="outline-light" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DashboardNav; 