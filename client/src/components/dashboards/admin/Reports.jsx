import { useState } from 'react';
import { Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FaDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';

function Reports() {
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('week');

  const attendanceData = [
    { name: 'Mon', Students: 65, Officers: 15 },
    { name: 'Tue', Students: 75, Officers: 12 },
    { name: 'Wed', Students: 85, Officers: 18 },
    { name: 'Thu', Students: 70, Officers: 14 },
    { name: 'Fri', Students: 90, Officers: 20 },
  ];

  const eventTypeData = [
    { name: 'Seminars', value: 35 },
    { name: 'Workshops', value: 25 },
    { name: 'Conferences', value: 20 },
    { name: 'Social Events', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="reports-container">
      <h2 className="page-title mb-4">Reports & Analytics</h2>
      
      <Row className="mb-4">
        <Col md={6} lg={4}>
          <Form.Group>
            <Form.Label>Report Type</Form.Label>
            <Form.Select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="attendance">Attendance Report</option>
              <option value="events">Events Report</option>
              <option value="users">User Activity Report</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6} lg={4}>
          <Form.Group>
            <Form.Label>Date Range</Form.Label>
            <Form.Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8}>
          <Card className="dashboard-card h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Attendance Overview</h5>
              <div className="btn-group">
                <Button variant="outline-secondary" size="sm">
                  <FaFilePdf className="me-2" />
                  PDF
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <FaFileExcel className="me-2" />
                  Excel
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Students" fill="#0088FE" />
                  <Bar dataKey="Officers" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="dashboard-card h-100">
            <Card.Header>
              <h5 className="mb-0">Event Distribution</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="dashboard-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Detailed Report</h5>
          <Button variant="primary" size="sm">
            <FaDownload className="me-2" />
            Download Report
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Total Attendees</th>
                <th>Completion Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tech Workshop 2024</td>
                <td>Mar 15, 2024</td>
                <td>45</td>
                <td>92%</td>
                <td><span className="badge bg-success">Completed</span></td>
              </tr>
              <tr>
                <td>Career Fair</td>
                <td>Mar 20, 2024</td>
                <td>120</td>
                <td>88%</td>
                <td><span className="badge bg-warning">In Progress</span></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Reports; 