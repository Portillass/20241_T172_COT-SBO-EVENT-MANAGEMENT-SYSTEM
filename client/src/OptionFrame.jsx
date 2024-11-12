import React from 'react';
import { useNavigate } from 'react-router-dom';

const OptionFrame = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Save the selected role in localStorage or state if needed
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div style={frameStyle}>
      <div style={innerStyle}>
        <h2>Select Your Role</h2>
        <button onClick={() => handleRoleSelection('Admin')} style={buttonStyle}>
          Admin
        </button>
        <button onClick={() => handleRoleSelection('Officer')} style={buttonStyle}>
          Officer
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
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default OptionFrame;
