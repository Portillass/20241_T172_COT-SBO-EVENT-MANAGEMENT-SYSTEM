import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaChartBar, FaCog, FaUserGraduate, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

function Events() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const [events, setEvents] = useState([]);

  // Fetch events on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/events')
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const statusColors = {
    Approved: 'green',
    Disapproved: 'red',
    Pending: 'gray',
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleEdit = (eventId) => {
    // Navigate to the edit page for the specific event
    navigate(`/edit-event/${eventId}`);
  };

  const handleDelete = (eventId) => {
    axios.delete(`http://localhost:3001/events/${eventId}`)
      .then(() => {
        setEvents(events.filter((event) => event._id !== eventId));
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
      });
  };

  const handleAddEvent = () => {
    // This will navigate to a page where users can add a new event
    navigate('/add-event');
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={brandStyle}>COT-SBO Event Management</div>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </header>

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <ul style={navLinksStyle}>
          <li style={navItemStyle}>
            <FaHome style={iconStyle} />
            <a href="/home" style={linkStyle}>Dashboard</a>
          </li>
          <li style={navItemStyle}>
            <FaCalendarAlt style={iconStyle} />
            <a href="/events" style={linkStyle}>Events</a>
          </li>
          <li style={navItemStyle}>
            <FaChartBar style={iconStyle} />
            <a href="/analytics" style={linkStyle}>Analytics</a>
          </li>
          <li style={navItemStyle}>
            <FaUserGraduate style={iconStyle} />
            <a href="/students" style={linkStyle}>Students</a>
          </li>
          <li style={navItemStyle}>
            <FaCog style={iconStyle} />
            <a href="/settings" style={linkStyle}>Settings</a>
          </li>
        </ul>
      </aside>

      {/* Main Content - Events Table */}
      <main style={mainContentStyle}>
        <h2 style={pageHeaderStyle}>Events</h2>

        {/* Add Event Button */}
        <button onClick={handleAddEvent} style={addEventButtonStyle}>+ Add Event</button>

        {/* Filter/Search */}
        <div style={filterStyle}>
          <input type="text" placeholder="Search events..." style={searchInputStyle} />
          <button style={filterButtonStyle}>Filter</button>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name of Event</th>
              <th style={thStyle}>Date Submitted</th>
              <th style={thStyle}>Schedule</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} onClick={() => handleEventClick(event._id)} style={rowStyle}>
                <td style={tdStyle}>{event.name}</td>
                <td style={tdStyle}>{event.dateSubmitted}</td>
                <td style={tdStyle}>{event.schedule}</td>
                <td style={{ ...tdStyle, color: statusColors[event.status] }}>{event.status}</td>
                <td style={tdStyle}>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(event._id); }} style={actionButtonStyle}>
                    <FaEdit />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(event._id); }} style={{ ...actionButtonStyle, backgroundColor: 'red' }}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

// Styles (Updated for consistency with StudentList)
const containerStyle = {
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  flexDirection: 'column',
};

const headerStyle = {
  width: '100%',
  height: '60px',
  backgroundColor: '#FF8C00', // Orange color
  color: '#fff',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
};

const brandStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
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

const sidebarStyle = {
  width: '250px',
  height: 'calc(100vh - 60px)', // Adjust for header height
  backgroundColor: '#2C3E50',
  color: '#ECF0F1',
  padding: '20px',
  position: 'fixed',
  top: '60px', // Below the header
  left: 0,
};

const navLinksStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

const navItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 0',
};

const linkStyle = {
  color: '#ECF0F1',
  textDecoration: 'none',
  fontSize: '16px',
  marginLeft: '10px',
};

const iconStyle = {
  fontSize: '18px',
};

const mainContentStyle = {
  marginLeft: '250px', // To account for sidebar width
  marginTop: '60px', // To account for header height
  padding: '20px',
  overflowY: 'auto',
  height: 'calc(100vh - 60px)',
};

const pageHeaderStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const filterStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
};

const searchInputStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginRight: '10px',
};

const filterButtonStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  backgroundColor: '#ff8c42',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle = {
  padding: '12px 15px',
  textAlign: 'left',
  backgroundColor: '#f4f4f4',
  borderBottom: '2px solid #ddd', // Bottom border for header cells
};

const tdStyle = {
  padding: '12px 15px',
  borderBottom: '1px solid #ddd', // Bottom border for data cells
};

const rowStyle = {
  cursor: 'pointer',
};

const addEventButtonStyle = {
  marginBottom: '20px', // Adjust to ensure space between the button and the table
  padding: '10px 20px',
  borderRadius: '5px',
  backgroundColor: 'green',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const actionButtonStyle = {
  padding: '5px 10px',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  marginRight: '10px',
  cursor: 'pointer',
};

export default Events;
