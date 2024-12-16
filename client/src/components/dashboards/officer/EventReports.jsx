import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { FaDownload, FaChartBar, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function EventReports() {
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(false);

  const attendanceData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const participationData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Participation Rate',
      data: [85, 72, 78, 90, 82, 75, 88],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const generateReport = () => {
    setLoading(true);
    // Implement report generation logic here
    setTimeout(() => setLoading(false), 1000);
  };

  const downloadReport = (format) => {
    // Implement download logic here
    console.log(`Downloading ${format} report...`);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Event Reports</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Report Type</Form.Label>
              <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="attendance">Attendance Report</option>
                <option value="participation">Participation Report</option>
                <option value="summary">Event Summary</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Date Range</Form.Label>
              <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button 
              variant="primary" 
              onClick={generateReport}
              disabled={loading}
              className="mb-3"
            >
              <FaChartBar className="me-2" />
              Generate Report
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>Attendance Overview</Card.Header>
              <Card.Body>
                <Pie data={attendanceData} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>Weekly Participation Rate</Card.Header>
              <Card.Body>
                <Bar data={participationData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mb-3">
          <Button variant="outline-primary" className="me-2" onClick={() => downloadReport('pdf')}>
            <FaFilePdf className="me-2" />
            Download PDF
          </Button>
          <Button variant="outline-success" onClick={() => downloadReport('excel')}>
            <FaFileExcel className="me-2" />
            Download Excel
          </Button>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Total Attendees</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Participation Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Team Building Workshop</td>
              <td>2024-01-15</td>
              <td>50</td>
              <td>45</td>
              <td>5</td>
              <td>90%</td>
            </tr>
            <tr>
              <td>Annual Meeting</td>
              <td>2024-01-20</td>
              <td>100</td>
              <td>95</td>
              <td>5</td>
              <td>95%</td>
            </tr>
            <tr>
              <td>Training Session</td>
              <td>2024-01-25</td>
              <td>30</td>
              <td>28</td>
              <td>2</td>
              <td>93%</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default EventReports;
