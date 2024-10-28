import React, { useState } from 'react';
import axios from 'axios';
import './EventManager.css'; // Add this line

function EventManager() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');

    const handleCreateEvent = () => {
        axios.post('/api/event/events', {
            title,
            date,
            location,
            capacity
        }).then(response => {
            console.log('Event created:', response.data);
        }).catch(error => {
            console.log('Error creating event:', error);
        });
    };

    return (
        <div className="event-manager">
            <h2>Create Event</h2>
            <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
            />
            <button onClick={handleCreateEvent}>Create Event</button>
        </div>
    );
}

export default EventManager;
