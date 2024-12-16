import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FaCalendarCheck } from 'react-icons/fa';

function Loading() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const messages = [
      'Loading resources...',
      'Preparing application...',
      'Almost there...',
      'Getting things ready...'
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingText(messages[messageIndex]);
    }, 1500);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <FaCalendarCheck size={60} className="loading-icon" />
        </div>
        <div className="loading-text">EventHub</div>
        <div className="loading-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="loading-status">{loadingText}</div>
        <div className="loading-percentage">{progress}%</div>
      </div>
    </div>
  );
}

export default Loading; 