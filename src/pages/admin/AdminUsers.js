import React from 'react';
import EnhancedUsersTable from '../../components/EnhancedUsersTable';

const AdminUsers = () => {

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4">User Management</h2>
            <EnhancedUsersTable 
              apiEndpoint="/admin/users"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;