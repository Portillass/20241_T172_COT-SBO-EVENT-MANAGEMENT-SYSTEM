import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddEvent() {
  const navigate = useNavigate();

  // Event form state
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = { name, theme, date, time, address };

    axios.post('http://localhost:3001/events', eventData)
      .then((response) => {
        console.log('Event added:', response.data);
        navigate('/events'); // Redirect to events list page after successful creation
      })
      .catch((error) => {
        console.error('Error adding event:', error);
        setError('Failed to create event');
      });
  };

  return (
    <div style={containerStyle}>
      {/* Branding Text Above the Form */}
      <div style={brandContainerStyle}>
        <div style={brandStyle}>COT-SBO Event Management</div>
        <div style={buttonContainerStyle}>
          <button onClick={() => navigate('/home')} style={backButtonStyle}>Back to Home</button>
          <button onClick={() => navigate('/')} style={buttonStyle}>Logout</button>
        </div>
      </div>

      {/* Main Content for Form */}
      <main style={mainContentStyle}>
        <h2 style={headingStyle}>Add New Event</h2> {/* Heading moved to the top of the form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Event Theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Event Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
          />
          {error && <p style={errorStyle}>{error}</p>}
          <button type="submit" style={submitButtonStyle}>Add Event</button>
        </form>
      </main>
    </div>
  );
}

// Inline Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
};

const brandContainerStyle = {
  backgroundColor: '#FF8C00',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
};

const brandStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#fff',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px', // Space between the buttons
};

const buttonStyle = {
  padding: '8px 15px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};

const backButtonStyle = {
  padding: '8px 15px',
  backgroundColor: '#007bff', // Blue color for the back button
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};

const mainContentStyle = {
  marginTop: '20px', // Space for the brand container
  padding: '20px',
  overflowY: 'auto',
  height: 'calc(100vh - 60px)',
};

const headingStyle = {
  marginBottom: '20px', // Space between the heading and form
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '500px',
  margin: '0 auto',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const submitButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const errorStyle = {
  color: 'red',
  fontSize: '14px',
};

export default AddEvent;
