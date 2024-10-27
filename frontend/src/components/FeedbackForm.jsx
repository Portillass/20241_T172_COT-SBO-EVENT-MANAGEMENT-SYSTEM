import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackForm.css';

function FeedbackForm() {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        axios.post('/api/feedback', { feedback })
            .then(response => {
                console.log('Feedback submitted:', response.data);
                setFeedback(''); // Clear the feedback input
            })
            .catch(error => {
                console.log('Error submitting feedback:', error);
            });
    };

    return (
        <div className="feedback-form">
            <h2>Submit Feedback</h2>
            <textarea
                placeholder="Your feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default FeedbackForm;
