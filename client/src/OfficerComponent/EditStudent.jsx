import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

function EditStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    studentID: '',
    firstName: '',
    lastName: '',
    course: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/students/${studentId}`)
      .then((response) => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
        setLoading(false);
      });
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/students/${studentId}`, student)
      .then(() => {
        navigate('/students');
      })
      .catch((error) => {
        console.error('Error updating student:', error);
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:3001/students/${studentId}`)
      .then(() => {
        navigate('/students');
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/home');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Header with Back and Logout Buttons */}
      <header style={headerStyle}>
        <div style={brandStyle}>COT-SBO Student Management</div>
        <div style={buttonsContainerStyle}>
          <button onClick={handleBack} style={backButtonStyle}>
            <FaArrowLeft /> Back Home
          </button>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <h2 style={headingStyle}>Edit Student</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="studentID" style={labelStyle}>Student ID</label>
            <input
              type="text"
              id="studentID"
              name="studentID"
              value={student.studentID}
              onChange={handleChange}
              disabled
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="firstName" style={labelStyle}>First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={student.firstName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="lastName" style={labelStyle}>Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={student.lastName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="course" style={labelStyle}>Course</label>
            <input
              type="text"
              id="course"
              name="course"
              value={student.course}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={buttonContainerStyle}>
            <button type="submit" style={submitButtonStyle}>Save</button>
            <button type="button" onClick={handleDelete} style={deleteButtonStyle}>Delete</button>
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
  justifyContent: 'flex-start',
};

const brandStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginRight: 'auto',
};

const buttonsContainerStyle = {
  display: 'flex',
  gap: '10px',
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

const headingStyle = {
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
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
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default EditStudent;
