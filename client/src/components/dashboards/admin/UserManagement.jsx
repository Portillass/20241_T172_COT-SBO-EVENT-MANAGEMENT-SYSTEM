import { useState, useEffect } from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useAuth } from '../../../context/AuthContext';

function UserManagement({ onUserUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/admin/users`;
      
      console.log('Fetching users from:', apiUrl); // Debug log
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      onUserUpdate?.();
    } catch (error) {
      console.error('Error details:', error); // Debug log
      setError(error.message || 'Error fetching users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      await fetchUsers();
      onUserUpdate?.(); // Call onUserUpdate after status change
    } catch (error) {
      setError('Error updating user status');
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });
      await fetchUsers();
      onUserUpdate?.(); // Call onUserUpdate after role change
    } catch (error) {
      setError('Error updating user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this user?')) {
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      await fetchUsers();
      onUserUpdate?.(); // Call onUserUpdate after user deletion
    } catch (error) {
      setError('Error deleting user: ' + error.message);
    }
  };

  // Calculate user statistics
  const userStats = {
    total: users.length,
    active: users.filter(user => user.status === 'active').length,
    pending: users.filter(user => user.status === 'pending').length,
    students: users.filter(user => user.role === 'student').length,
    officers: users.filter(user => user.role === 'officer').length,
    admins: users.filter(user => user.role === 'admin').length
  };

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Role',
      cell: row => (
        <Form.Select
          value={row.role}
          onChange={(e) => handleRoleChange(row._id, e.target.value)}
          disabled={row.role === 'admin'}
          style={{ width: '120px' }}
        >
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="officer">Officer</option>
        </Form.Select>
      ),
      sortable: true,
    },
    {
      name: 'Status',
      cell: row => (
        <Badge bg={
          row.status === 'active' ? 'success' :
          row.status === 'pending' ? 'warning' : 'danger'
        }>
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        row.role !== 'admin' && (
          <div className="d-flex gap-2">
            {row.status === 'pending' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => handleStatusChange(row._id, 'active')}
              >
                Activate
              </Button>
            )}
            {row.status === 'active' && (
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleStatusChange(row._id, 'archived')}
              >
                Archive
              </Button>
            )}
            {row.status === 'archived' && (
              <Button
                variant="info"
                size="sm"
                onClick={() => handleStatusChange(row._id, 'active')}
              >
                Restore
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteUser(row._id)}
            >
              Delete
            </Button>
          </div>
        )
      ),
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '60px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
  };

  const filteredUsers = users.filter(
    user => user.name?.toLowerCase().includes(filterText.toLowerCase()) ||
           user.email?.toLowerCase().includes(filterText.toLowerCase()) ||
           user.role?.toLowerCase().includes(filterText.toLowerCase()) ||
           user.status?.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponent = (
    <div className="w-100 d-flex justify-content-between align-items-center mb-3">
      <Form.Control
        type="text"
        placeholder="Search users..."
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        className="w-25"
      />
      <div className="d-flex gap-3">
        <Badge bg="primary" className="p-2">
          Total Users: {userStats.total}
        </Badge>
        <Badge bg="dark" className="p-2">
          Admins: {userStats.admins}
        </Badge>
        <Badge bg="success" className="p-2">
          Students: {userStats.students}
        </Badge>
        <Badge bg="info" className="p-2">
          Officers: {userStats.officers}
        </Badge>
        <Badge bg="warning" className="p-2">
          Pending: {userStats.pending}
        </Badge>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-table p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-table">
      <DataTable
        title="User Management"
        columns={columns}
        data={filteredUsers}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponent}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
        striped
        responsive
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 300px)"
      />
    </div>
  );
}

export default UserManagement;