import React from 'react';
import { useNavigate } from 'react-router-dom';

const Frame = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/options'); // Navigate to the options page
  };

  return (
    <div style={frameStyle}>
      <div style={innerStyle}>
        <h2>Welcome to COT-SBO Event Management System</h2>
        <button onClick={handleGetStarted} style={buttonStyle}>
          Get Started
        </button>
      </div>
    </div>
  );
};

const frameStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f8f9fa',
};

const innerStyle = {
  width: '400px',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default Frame;
