import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import EventManager from './components/EventManager';
import EventList from './components/EventList';
import AttendanceTracker from './components/AttendanceTracker';
import FeedbackForm from './components/FeedbackForm';
import Login from './components/Login';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/admin" component={AdminDashboard} />
                    <Route path="/manage-events" component={EventManager} />
                    <Route path="/events" component={EventList} />
                    <Route path="/attendance" component={AttendanceTracker} />
                    <Route path="/feedback" component={FeedbackForm} />
                    <Route path="/login" component={Login} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;