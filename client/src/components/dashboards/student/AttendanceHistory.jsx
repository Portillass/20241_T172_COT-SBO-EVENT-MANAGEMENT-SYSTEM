import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from '../../../utils/axios';

function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/attendance/history');
        setHistory(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch attendance history. Please try again later.');
        console.error('Error fetching attendance history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (history.length === 0) {
    return (
      <Alert variant="info">
        No attendance records found.
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Attendance History</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record._id}>
                  <td>{record.eventTitle}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.time}</td>
                  <td>{record.location}</td>
                  <td>
                    <Badge 
                      bg={record.status === 'Present' ? 'success' : 
                         record.status === 'Late' ? 'warning' : 'danger'}
                    >
                      {record.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AttendanceHistory;
