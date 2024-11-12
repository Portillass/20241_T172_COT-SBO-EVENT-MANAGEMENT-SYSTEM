import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for client-side navigation
import { FaHome, FaCalendarAlt, FaChartBar, FaCog, FaUserGraduate } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Navigate to the homepage or login page
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={brandStyle}>COT-SBO Event Management</div>
        <button onClick={handleLogout} style={buttonStyle}>Logout</button>
      </header>

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <ul style={navLinksStyle}>
          <li style={navItemStyle}>
            <FaHome style={iconStyle} />
            <Link to="/home" style={linkStyle}>Dashboard</Link>
          </li>
          <li style={navItemStyle}>
            <FaCalendarAlt style={iconStyle} />
            <Link to="/events" style={linkStyle}>Events</Link>
          </li>
          <li style={navItemStyle}>
            <FaChartBar style={iconStyle} />
            <Link to="/analytics" style={linkStyle}>Analytics</Link>
          </li>
          <li style={navItemStyle}>
            <FaUserGraduate style={iconStyle} />
            <Link to="/students" style={linkStyle}>Students</Link> {/* Updated link for Students */}
          </li>
          <li style={navItemStyle}>
            <FaCog style={iconStyle} />
            <Link to="/settings" style={linkStyle}>Settings</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <div style={dashboardGridStyle}>
          <div style={cardStyle}>
            <h3>Pending for Approval</h3>
            <div style={cardContentStyle}></div>
          </div>
          <div style={cardStyle}>
            <h3>Attendance Analytics</h3>
            <div style={cardContentStyle}></div>
          </div>
          <div style={cardStyle}>
            <h3>Calendar</h3>
            <div style={cardContentStyle}></div>
          </div>
          <div style={cardStyle}>
            <h3>Upcoming Events</h3>
            <div style={cardContentStyle}></div>
          </div>
        </div>
      </main>
    </div>
  );
}

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

const dashboardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  backgroundColor: '#f8f9fa',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  padding: '20px',
};

const cardContentStyle = {
  height: '150px',
  backgroundColor: '#e9ecef',
  borderRadius: '10px',
};

export default Home;
