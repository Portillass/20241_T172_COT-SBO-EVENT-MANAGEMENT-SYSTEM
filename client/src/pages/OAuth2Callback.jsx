import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

function OAuth2Callback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract code and state from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          throw new Error('No authorization code found');
        }

        // Send the authorization code to the backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.pendingApproval) {
          navigate('/login', { 
            state: { 
              message: 'Your account is pending administrator approval.' 
            } 
          });
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || 'Authentication failed');
        }

        // Store user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to appropriate dashboard
        navigate(data.redirectUrl);
      } catch (error) {
        console.error('OAuth Callback Error:', error);
        navigate('/login', { 
          state: { 
            error: error.message || 'Authentication failed. Please try again.' 
          } 
        });
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  return (
    <Container className="py-5 text-center">
      <Spinner animation="border" role="status" />
      <p className="mt-3">Authenticating...</p>
    </Container>
  );
}

export default OAuth2Callback;
