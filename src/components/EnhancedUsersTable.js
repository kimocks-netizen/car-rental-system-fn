import React, { useState } from 'react';
import useFrontendTableData from '../hooks/useFrontendTableData';
import EnhancedDataTable from './common/EnhancedDataTable';
import Badge from './common/Badge';
import ConfirmationModal from './common/ConfirmationModal';
import { CancelButton, SubmitButton } from './common/ActionButtons';
import { API_BASE_URL } from '../utils/api';

const EnhancedUsersTable = ({ apiEndpoint = '/admin/users' }) => {
  // Fetch function for users (fetch all data once)
  const fetchUsers = async () => {
    const response = await fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL}${apiEndpoint}?limit=1000`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data.users || result.data;
    }
    throw new Error(result.message || 'Failed to fetch users');
  };

  const {
    data: users,
    loading: tableLoading,
    error,
    totalItems,
    totalPages,
    searchTerm,
    handleSearch,
    filters,
    handleFilterChange,
    clearFilters,
    sortConfig,
    handleSort,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refresh
  } = useFrontendTableData(fetchUsers, {}, { field: 'created_at', direction: 'desc' });

  // Table columns configuration
  const columns = [
    {
      key: 'avatar',
      header: 'Avatar',
      render: (value, row) => (
        <img 
          src={value || '/photos/avatar.png'} 
          alt={row.full_name} 
          style={{ 
            width: '40px', 
            height: '40px', 
            objectFit: 'cover', 
            borderRadius: '50%' 
          }}
        />
      )
    },
    {
      key: 'full_name',
      header: 'Full Name',
      sortable: true
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (value) => value || 'N/A'
    },
    {
      key: 'user_role',
      header: 'Role',
      sortable: true,
      render: (value) => <Badge variant={value}>{value}</Badge>
    },
    {
      key: 'user_status',
      header: 'Status',
      sortable: true,
      render: (value) => <Badge variant={value || 'active'}>{value || 'active'}</Badge>
    },

    {
      key: 'created_at',
      header: 'Joined',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.user_role);
    setShowEditModal(true);
  };

  const handleSuspendUser = (user) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const handleUnsuspendUser = (user) => {
    setSelectedUser(user);
    setShowUnsuspendModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmRoleChange = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        refresh();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const confirmSuspend = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'suspended' })
      });

      if (response.ok) {
        refresh();
      }
    } catch (error) {
      console.error('Error suspending user:', error);
    } finally {
      setLoading(false);
      setShowSuspendModal(false);
      setSelectedUser(null);
    }
  };

  const confirmUnsuspend = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'active' })
      });

      if (response.ok) {
        refresh();
      }
    } catch (error) {
      console.error('Error unsuspending user:', error);
    } finally {
      setLoading(false);
      setShowUnsuspendModal(false);
      setSelectedUser(null);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        refresh();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  // Actions configuration
  const actions = [
    {
      label: 'Edit User',
      icon: 'fas fa-edit',
      onClick: handleEditUser
    },
    {
      label: (user) => (user.user_status === 'suspended') ? 'Unsuspend User' : 'Suspend User',
      icon: (user) => (user.user_status === 'suspended') ? 'fas fa-check-circle' : 'fas fa-ban',
      onClick: (user) => (user.user_status === 'suspended') ? handleUnsuspendUser(user) : handleSuspendUser(user),
      disabled: (user) => user.user_role === 'admin'
    },
    {
      label: 'Delete User',
      icon: 'fas fa-trash',
      onClick: handleDeleteUser,
      disabled: (user) => user.user_role === 'admin'
    }
  ];

  // Filter configuration
  const filterConfig = [
    {
      key: 'user_role',
      label: 'Role',
      placeholder: 'All Roles',
      options: [
        { value: 'customer', label: 'Customer' },
        { value: 'staff', label: 'Staff' },
        { value: 'admin', label: 'Admin' }
      ]
    },
    {
      key: 'user_status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  // Sort options
  const sortOptions = [
    { value: 'created_at-desc', label: 'Newest First' },
    { value: 'created_at-asc', label: 'Oldest First' },
    { value: 'full_name-asc', label: 'Name: A to Z' },
    { value: 'full_name-desc', label: 'Name: Z to A' },
    { value: 'email-asc', label: 'Email: A to Z' },
    { value: 'email-desc', label: 'Email: Z to A' },
    { value: 'last_login-desc', label: 'Last Login: Recent First' },
    { value: 'last_login-asc', label: 'Last Login: Oldest First' }
  ];

  return (
    <>
      <EnhancedDataTable
        title="Users Management"
        data={users}
        columns={columns}
        actions={actions}
        loading={tableLoading}
        error={error}
        rowStyle={(user) => user.user_status === 'suspended' ? {
          opacity: 0.3,
          backgroundColor: 'rgba(128, 128, 128, 0.2)',
          color: '#666',
          pointerEvents: 'none',
          filter: 'grayscale(100%)',
          textDecoration: 'line-through'
        } : {}}
        
        // Search
        searchTerm={searchTerm}
        onSearch={handleSearch}
        searchPlaceholder="Search by name, email..."
        
        // Sort
        sortConfig={sortConfig}
        onSort={handleSort}
        sortOptions={sortOptions}
        
        // Filters
        filters={filterConfig}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        
        // Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Edit User Role Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto', overflow: 'auto'}}>
          <div className="modal-dialog" style={{marginTop: '120px', marginBottom: '50px', pointerEvents: 'auto'}}>
            <div style={{
              backgroundColor: 'black',
              border: '2px solid red',
              borderRadius: '15px',
              padding: '25px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(255, 0, 0, 0.1)',
              position: 'relative',
              pointerEvents: 'auto'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid rgba(255, 0, 0, 0.3)'
              }}>
                <h5 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Edit User Role</h5>
                <button 
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Form Content */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '20px' }}>
                  <p style={{ color: 'white', marginBottom: '20px', fontSize: '1rem' }}>Change role for: <strong>{selectedUser?.full_name}</strong></p>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Select Role:</label>
                    <select 
                      value={newRole} 
                      onChange={(e) => setNewRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 0, 0, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <CancelButton onClick={() => setShowEditModal(false)} />
                    <SubmitButton onClick={confirmRoleChange} loading={loading}>
                      Update Role
                    </SubmitButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      <ConfirmationModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={confirmSuspend}
        title="Suspend User"
        message={`Are you sure you want to suspend ${selectedUser?.full_name}? They will not be able to access the system.`}
        confirmText="Suspend User"
        cancelText="Cancel"
        loading={loading}
        type="warning"
      />

      {/* Unsuspend User Modal */}
      <ConfirmationModal
        isOpen={showUnsuspendModal}
        onClose={() => setShowUnsuspendModal(false)}
        onConfirm={confirmUnsuspend}
        title="Unsuspend User"
        message={`Are you sure you want to reactivate ${selectedUser?.full_name}? They will regain access to the system.`}
        confirmText="Unsuspend User"
        cancelText="Cancel"
        loading={loading}
        type="primary"
      />

      {/* Delete User Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${selectedUser?.full_name}? This action cannot be undone and will remove all their data.`}
        confirmText="Delete User"
        cancelText="Cancel"
        loading={loading}
        type="danger"
      />
    </>
  );
};

export default EnhancedUsersTable;