import { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Image } from 'react-bootstrap';
import LoginModal from './modals/LoginModal';
import SignupModal from './modals/SignupModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ScrollProgress from './ScrollProgress';
import ScrollToTop from './ScrollToTop';
import Loading from './Loading';
import { FaCalendar, FaUsers, FaChartBar, FaArrowRight } from 'react-icons/fa';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    // Check if user is logged in and redirect
    if (user) {
      const role = user.role?.toLowerCase();
      if (role) {
        navigate(`/dashboard/${role}`);
      }
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [user, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  const features = [
    {
      icon: <FaCalendar />,
      title: "Event Management",
      description: "Create and manage events effortlessly. Set up registrations, track attendance, and send notifications."
    },
    {
      icon: <FaUsers />,
      title: "Attendance Tracking",
      description: "Monitor attendance in real-time. Generate QR codes, scan tickets, and manage check-ins efficiently."
    },
    {
      icon: <FaChartBar />,
      title: "Analytics & Reports",
      description: "Get comprehensive insights with detailed analytics and customizable reports for your events."
    }
  ];

  return (
    <div className="landing-page">
      <ScrollProgress />
      <Navbar 
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
      />

      <section id="hero" className="hero-section">
        <div className="hero-background"></div>
        <Container>
          <Row className="align-items-center">
            <Col md={6} className={`hero-content ${isVisible.hero ? 'animate__animated animate__fadeInLeft' : ''}`}>
              <h1 className="hero-title">
                Streamline Your
                <span className="text-gradient"> Events</span>
              </h1>
              <p className="hero-subtitle">
                Simplify event management and attendance tracking with our comprehensive platform
              </p>
              <div className="hero-buttons">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="btn-glow"
                  onClick={() => setShowSignup(true)}
                >
                  Get Started <FaArrowRight className="ms-2" />
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => setShowSignup(true)}
                >
                  Learn More
                </Button>
              </div>
            </Col>
            <Col md={6} className={`mt-4 mt-md-0 ${isVisible.hero ? 'animate__animated animate__fadeInRight' : ''}`}>
              <div className="hero-image-wrapper">
                <Image src="/src/assets/logo.png" fluid className="hero-image" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="features" className="features-section">
        <Container>
          <h2 className={`section-title text-center mb-5 ${isVisible.features ? 'animate__animated animate__fadeInUp' : ''}`}>
            Powerful Features
          </h2>
          <Row>
            {features.map((feature, index) => (
              <Col lg={4} className="mb-4" key={index}>
                <div className={`feature-card ${isVisible.features ? `animate__animated animate__fadeInUp animate__delay-${index}s` : ''}`}>
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="cta" className="cta-section">
        <div className="cta-background"></div>
        <Container className="text-center">
          <div className={`cta-content ${isVisible.cta ? 'animate__animated animate__fadeInUp' : ''}`}>
            <h2 className="mb-4">Ready to Transform Your Events?</h2>
            <p className="mb-5">
              Join thousands of organizers who trust EventHub for their event management needs.
            </p>
            <Button 
              variant="primary"
              size="lg"
              className="btn-glow"
              onClick={() => setShowSignup(true)}
            >
              Start  <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      <LoginModal 
        show={showLogin} 
        onHide={() => setShowLogin(false)}
        onSignupClick={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupModal 
        show={showSignup} 
        onHide={() => setShowSignup(false)}
        onLoginClick={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />

      <ScrollToTop />
    </div>
  );
}

export default LandingPage; 