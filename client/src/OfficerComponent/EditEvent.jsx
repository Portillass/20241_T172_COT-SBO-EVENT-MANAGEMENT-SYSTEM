import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditEvent() {
  const { eventId } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    name: '',
    dateSubmitted: '',
    schedule: '',
    status: 'Pending',
  });
  const [loading, setLoading] = useState(true);

  // Fetch event data on component mount
  useEffect(() => {
    axios.get(`http://localhost:3001/events/${eventId}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [eventId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  // Handle form submission (update event)
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/events/${eventId}`, event)
      .then(() => {
        navigate('/events'); // Redirect back to the events list after updating
      })
      .catch((error) => {
        console.error('Error updating event:', error);
      });
  };

  // Loading spinner or message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Logout function
  const handleLogout = () => {
    // Clear session or token if necessary (e.g., localStorage, cookies)
    navigate('/login'); // Navigate to login page
  };

  // Back button function
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div style={containerStyle}>
      {/* Header with Back and Logout Buttons */}
      <header style={headerStyle}>
        <div style={brandStyle}>COT-SBO Event Management</div>
        <div style={buttonsContainerStyle}>
          <button onClick={handleBack} style={backButtonStyle}>Back</button>
          <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <h2 style={headingStyle}>Edit Event</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="name" style={labelStyle}>Name of Event</label>
            <input
              type="text"
              id="name"
              name="name"
              value={event.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="dateSubmitted" style={labelStyle}>Date Submitted</label>
            <input
              type="date"
              id="dateSubmitted"
              name="dateSubmitted"
              value={event.dateSubmitted}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="schedule" style={labelStyle}>Schedule</label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={event.schedule}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="status" style={labelStyle}>Status</label>
            <select
              id="status"
              name="status"
              value={event.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Disapproved">Disapproved</option>
            </select>
          </div>

          <div style={buttonContainerStyle}>
            <button type="submit" style={submitButtonStyle}>Update Event</button>
            <button type="button" onClick={() => navigate('/events')} style={cancelButtonStyle}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
}

// Styles for the edit page
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  padding: '20px',
};

const headerStyle = {
  backgroundColor: '#FF8C00', // Orange color
  color: '#fff',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',  // Align items starting from the left
};

const brandStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginRight: 'auto',  // Push the brand to the left
};

const buttonsContainerStyle = {
  display: 'flex',
  gap: '10px',  // Space between Back and Logout buttons
};

const backButtonStyle = {
  padding: '8px 15px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};

const logoutButtonStyle = {
  padding: '8px 15px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};

const mainContentStyle = {
  marginTop: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '500px',
  margin: '0 auto',
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  fontSize: '16px',
  marginBottom: '5px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
};

const submitButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#FF8C00',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const cancelButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#ccc',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const headingStyle = {
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
};

export default EditEvent;
