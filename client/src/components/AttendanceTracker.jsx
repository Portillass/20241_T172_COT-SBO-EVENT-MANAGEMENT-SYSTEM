import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AttendanceTracker.css';

function AttendanceTracker() {
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        axios.get('/api/attendance/:eventId')
            .then(response => setAttendance(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div className="attendance-tracker">
            <h2>Attendance Tracker</h2>
            <ul>
                {attendance.map(record => (
                    <li key={record._id}>
                        {record.userId} - {new Date(record.checkInTime).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AttendanceTracker;
