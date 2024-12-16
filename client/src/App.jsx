<<<<<<< HEAD
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CalendarProvider } from './context/CalendarContext';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import OfficerDashboard from './components/dashboards/officer/OfficerDashboard';
import StudentDashboard from './components/dashboards/student/StudentDashboard';
import OAuth2Callback from './pages/OAuth2Callback';
import Loading from './components/Loading';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <CalendarProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth2callback" element={<OAuth2Callback />} />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/officer"
          element={
            <PrivateRoute allowedRoles={['officer']}>
              <OfficerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/student"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </CalendarProvider>
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Frame from './Frame';
import OptionFrame from './OptionFrame';
import EventDetails from "./OfficerComponent/EventDetails.jsx";
import AddEvent from './OfficerComponent/AddEvent.jsx';
import EditEvent from './OfficerComponent/EditEvent.jsx';
import StudentList from './OfficerComponent/StudentList.jsx'; // Import the StudentList component
import AddStudent from './OfficerComponent/AddStudent.jsx'; // Import AddStudent component
import EditStudent from './OfficerComponent/EditStudent.jsx'; // Import EditStudent component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Frame />} />
        <Route path='/options' element={<OptionFrame />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path="/events" element={<EventDetails />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/edit-event/:eventId" element={<EditEvent />} />
        
        {/* Student Routes */}
        <Route path="/students" element={<StudentList />} /> {/* The Students List Page */}
        <Route path="/add-student" element={<AddStudent />} /> {/* Page to Add a Student */}
        <Route path="/edit-student/:studentId" element={<EditStudent />} /> {/* Page to Edit a Student */}
      </Routes>
    </BrowserRouter>
>>>>>>> QA
  );
}

export default App;
