import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventList.css'; // Add this line

function EventList() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('/api/event/events')
            .then(response => setEvents(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div className="event-list">
            <h2>Upcoming Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event._id} className="event-item">
                        {event.title} - {new Date(event.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EventList;
