import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract code and state from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const returnedState = urlParams.get('state');

        // Validate parameters
        if (!code) {
          throw new Error('No authorization code found');
        }

        // Retrieve and validate stored state
        const storedState = localStorage.getItem('oauth_state');
        
        // Decode and parse stored state
        const parsedStoredState = storedState ? JSON.parse(atob(storedState)) : null;
        const parsedReturnedState = returnedState ? JSON.parse(atob(returnedState)) : null;

        // Comprehensive state validation
        if (!parsedStoredState || !parsedReturnedState) {
          throw new Error('State validation failed: Missing state parameters');
        }

        // Check state integrity
        const stateIsValid = 
          parsedStoredState.timestamp && 
          parsedReturnedState.timestamp &&
          (Date.now() - parsedStoredState.timestamp) < 15 * 60 * 1000; // 15 minutes expiry

        if (!stateIsValid) {
          throw new Error('State validation failed: Expired or invalid state');
        }

        // Clear stored state
        localStorage.removeItem('oauth_state');

        // Send code to backend for token exchange
        const response = await axios.post('/api/auth/google/callback', { 
          code, 
          state: returnedState 
        });

        // Handle successful authentication
        console.log('OAuth Authentication Successful', response.data);
        
        // Store tokens securely
        localStorage.setItem('googleToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        
        // Store user info
        if (response.data.user) {
          localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        }

        // Store application token
        if (response.data.app_token) {
          localStorage.setItem('appToken', response.data.app_token);
        }

        // Redirect to dashboard
        navigate('/dashboard/officer');

      } catch (error) {
        console.error('OAuth Callback Error:', error);
        
        // Set error state for display
        setError({
          message: error.message || 'Authentication failed',
          details: error.response?.data?.details || 'Unknown error occurred'
        });

        // Redirect to login with error
        navigate('/login', { 
          state: { 
            error: error.message || 'Authentication failed. Please try again.' 
          } 
        });
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  // Error display component
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Authentication Error</h4>
          <p>{error.message}</p>
          {error.details && (
            <details>
              <summary>More Details</summary>
              <pre>{error.details}</pre>
            </details>
          )}
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => navigate('/login')}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Processing authentication...</span>
        </div>
        <p className="mt-3">Authenticating with Google, please wait...</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
