import { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { FcGoogle } from 'react-icons/fc';
import PendingApprovalModal from './PendingApprovalModal';

function LoginModal({ show, onHide, onSignupClick }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState('');
  const [recaptchaLoading, setRecaptchaLoading] = useState(true);
  const [showPendingApproval, setShowPendingApproval] = useState(false);
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setRecaptchaError('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login({ ...formData, recaptchaToken });
      onHide();
      setFormData({ email: '', password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await googleLogin();
      if (result?.pendingApproval) {
        setShowPendingApproval(true);
      } else {
        onHide();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Button 
            variant="outline-dark" 
            className="w-100 mb-3 google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle className="me-2" size={20} />
            Continue with Google
          </Button>

          <div className="text-center mb-3">
            <span className="divider">OR</span>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <div className="d-flex justify-content-end mt-1">
                <Button 
                  variant="link" 
                  className="p-0 text-decoration-none"
                  onClick={() => {
                    onHide();
                    // Add logic to show forgot password modal
                  }}
                >
                  Forgot Password?
                </Button>
              </div>
            </Form.Group>

            <div className="recaptcha-container mb-3">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => {
                  setRecaptchaToken(token);
                  setRecaptchaError('');
                }}
                onExpired={() => {
                  setRecaptchaToken(null);
                  setRecaptchaError('reCAPTCHA has expired, please verify again');
                }}
                onError={() => {
                  setRecaptchaError('Error loading reCAPTCHA');
                }}
              />
              {recaptchaError && (
                <div className="text-danger small mt-1">{recaptchaError}</div>
              )}
            </div>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={!recaptchaToken}
            >
              Login
            </Button>
          </Form>
        </Modal.Body>
        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Button
            variant="link"
            onClick={onSignupClick}
            className="p-0 ms-1"
          >
            Sign up here
          </Button>
        </div>
      </Modal>

      <PendingApprovalModal 
        show={showPendingApproval} 
        onHide={() => setShowPendingApproval(false)} 
      />
    </>
  );
}

export default LoginModal; 