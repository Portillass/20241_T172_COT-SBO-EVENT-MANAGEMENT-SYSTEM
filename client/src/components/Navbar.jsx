import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Logo from './Logo';

function NavigationBar({ onLoginClick, onSignupClick }) {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      expanded={expanded} 
      expand="lg" 
      variant="dark" 
      fixed="top" 
      className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand href="/" className="brand-logo">
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features" onClick={() => setExpanded(false)}>Features</Nav.Link>
            <Nav.Link href="#events" onClick={() => setExpanded(false)}>Events</Nav.Link>
            <Nav.Link href="#about" onClick={() => setExpanded(false)}>About</Nav.Link>
          </Nav>
          <Nav className="nav-buttons">
            <Button 
              variant="outline-light" 
              className="me-2 nav-btn"
              onClick={() => {
                onLoginClick();
                setExpanded(false);
              }}
            >
              Login
            </Button>
            <Button 
              variant="primary"
              className="nav-btn"
              onClick={() => {
                onSignupClick();
                setExpanded(false);
              }}
            >
              Sign Up
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar; 