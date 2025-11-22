import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import adminService from '../../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.data.users || response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    { key: 'full_name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'user_role', header: 'Role' },
    { 
      key: 'created_at', 
      header: 'Joined',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const userActions = [
    {
      label: <i className="fas fa-edit" style={{color: 'white'}}></i>,
      className: 'btn-link',
      onClick: (user) => {
        console.log('Edit role for:', user);
      },
      title: 'Edit Role'
    },
    {
      label: <i className="fas fa-ban" style={{color: '#dc3545'}}></i>,
      className: 'btn-link',
      onClick: (user) => {
        console.log('Suspend user:', user);
      },
      title: 'Suspend User'
    }
  ];

  if (loading) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="text-center text-white">
            <h3>Loading users...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="alert alert-danger">
            <h5>Error loading users</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchUsers}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4">User Management</h2>
            <DataTable 
              title={`All Users (${users.length})`}
              data={users}
              columns={userColumns}
              actions={userActions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;