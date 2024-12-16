import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Button, Row, Col } from 'react-bootstrap';
import { FaCheck, FaTimes, FaQrcode, FaUserCheck } from 'react-icons/fa';

function AttendanceTracker({ event }) {
  const [attendees, setAttendees] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API call
    setAttendees([
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'present', timeIn: '09:00 AM' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'absent', timeIn: null },
      { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'present', timeIn: '09:15 AM' },
    ]);
  }, [event]);

  const handleScanQR = () => {
    setIsScanning(true);
    // Implement QR code scanning logic here
  };

  const handleManualCheckIn = (attendeeId) => {
    setAttendees(attendees.map(attendee => {
      if (attendee.id === attendeeId) {
        return {
          ...attendee,
          status: 'present',
          timeIn: new Date().toLocaleTimeString()
        };
      }
      return attendee;
    }));
  };

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Attendance Tracker</h5>
        <Button variant="light" size="sm" onClick={handleScanQR}>
          <FaQrcode className="me-2" />
          Scan QR Code
        </Button>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="text-end">
            <Badge bg="success" className="me-2">
              Present: {attendees.filter(a => a.status === 'present').length}
            </Badge>
            <Badge bg="danger">
              Absent: {attendees.filter(a => a.status === 'absent').length}
            </Badge>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Time In</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id}>
                  <td>{attendee.name}</td>
                  <td>{attendee.email}</td>
                  <td>
                    <Badge bg={attendee.status === 'present' ? 'success' : 'danger'}>
                      {attendee.status === 'present' ? <FaCheck /> : <FaTimes />}
                      {' '}
                      {attendee.status}
                    </Badge>
                  </td>
                  <td>{attendee.timeIn || '-'}</td>
                  <td>
                    {attendee.status === 'absent' && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleManualCheckIn(attendee.id)}
                      >
                        <FaUserCheck className="me-1" />
                        Check In
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AttendanceTracker;
