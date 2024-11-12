import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome, FaCalendarAlt, FaChartBar, FaCog, FaUserGraduate, FaEdit, FaTrash } from "react-icons/fa";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const navigate = useNavigate();

  // Fetch students when the component mounts
  const fetchStudents = () => {
    axios
      .get("http://localhost:3001/students")
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete a student
  const handleDelete = (studentId) => {
    axios
      .delete(`http://localhost:3001/students/${studentId}`)
      .then(() => {
        fetchStudents(); // Refetch students after delete to ensure updated list
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter students based on search query
  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentID.toString().includes(searchQuery) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.headerContainer}>
        <div style={styles.headerText}>Student Management</div>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </header>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <ul style={styles.navLinks}>
          <li style={styles.navItem}>
            <FaHome style={styles.iconStyle} />
            <Link to="/home" style={styles.navLink}>Dashboard</Link>
          </li>
          <li style={styles.navItem}>
            <FaCalendarAlt style={styles.iconStyle} />
            <Link to="/events" style={styles.navLink}>Events</Link>
          </li>
          <li style={styles.navItem}>
            <FaChartBar style={styles.iconStyle} />
            <Link to="/analytics" style={styles.navLink}>Analytics</Link>
          </li>
          <li style={styles.navItem}>
            <FaUserGraduate style={styles.iconStyle} />
            <Link to="/students" style={styles.navLink}>Students</Link>
          </li>
          <li style={styles.navItem}>
            <FaCog style={styles.iconStyle} />
            <Link to="/settings" style={styles.navLink}>Settings</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <h2 style={styles.header}>Student List</h2>

        {/* Add Student Button */}
        <div style={styles.addStudentContainer}>
          <Link to="/add-student" style={styles.addButton}>Add Student</Link>
        </div>

        {/* Search Input */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search students..."
            style={styles.searchInput}
          />
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>Student ID</th>
              <th style={styles.tableCell}>First Name</th>
              <th style={styles.tableCell}>Last Name</th>
              <th style={styles.tableCell}>Course</th>
              <th style={styles.tableCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id || student._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{student.studentID}</td>
                  <td style={styles.tableCell}>{student.firstName}</td>
                  <td style={styles.tableCell}>{student.lastName}</td>
                  <td style={styles.tableCell}>{student.course}</td>
                  <td style={styles.tableCell}>
                    <Link to={`/edit-student/${student.id || student._id}`} style={styles.editButton}>
                      <FaEdit style={styles.icon} />
                    </Link>
                    <button
                      onClick={() => handleDelete(student.id || student._id)}
                      style={styles.deleteButton}
                    >
                      <FaTrash style={styles.icon} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noDataCell}>
                  No students available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    flexDirection: "row",
  },
  headerContainer: {
    backgroundColor: "#FF8C00",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
  },
  headerText: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  logoutButton: {
    padding: "8px 15px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#2C3E50",
    color: "#ECF0F1",
    padding: "20px",
    position: "fixed",
    top: "60px",
    left: 0,
    height: "calc(100vh - 60px)",
  },
  navLinks: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
  },
  navLink: {
    color: "#ECF0F1",
    textDecoration: "none",
    fontSize: "16px",
    marginLeft: "10px",
  },
  iconStyle: {
    fontSize: "18px",
  },
  mainContent: {
    marginLeft: "250px",
    marginTop: "60px",
    padding: "20px",
    width: "calc(100% - 250px)",
  },
  addStudentContainer: {
    marginBottom: "20px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  resetButtonContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "20px",
  },
  filterButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
  },
  tableRow: {
    backgroundColor: "#ffffff",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  editButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  deleteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    marginLeft: "10px",
  },
  icon: {
    fontSize: "18px",
  },
  noDataCell: {
    textAlign: "center",
    padding: "10px",
    fontSize: "16px",
    color: "#888",
  },
};

export default StudentList;
