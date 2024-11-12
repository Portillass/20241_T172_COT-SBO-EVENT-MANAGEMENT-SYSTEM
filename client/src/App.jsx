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
  );
}

export default App;
