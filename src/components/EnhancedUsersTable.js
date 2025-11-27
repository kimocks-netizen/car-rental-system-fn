import React from 'react';
import useFrontendTableData from '../hooks/useFrontendTableData';
import EnhancedDataTable from './common/EnhancedDataTable';
import Badge from './common/Badge';

const EnhancedUsersTable = ({ apiEndpoint = '/api/admin/users' }) => {
  // Fetch function for users (fetch all data once)
  const fetchUsers = async () => {
    const response = await fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL || 'http://localhost:8000'}${apiEndpoint}?limit=1000`, {
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
    loading,
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

  // Actions configuration
  const actions = [
    {
      label: 'View Profile',
      icon: 'fas fa-eye',
      onClick: (user) => {
        console.log('View user:', user);
      }
    },
    {
      label: 'Edit User',
      icon: 'fas fa-edit',
      onClick: (user) => {
        console.log('Edit user:', user);
      }
    },
    {
      label: 'Suspend User',
      icon: 'fas fa-ban',
      onClick: (user) => {
        if (window.confirm('Are you sure you want to suspend this user?')) {
          console.log('Suspend user:', user);
        }
      },
      disabled: (user) => user.user_status === 'suspended' || user.user_role === 'admin'
    },
    {
      label: 'Activate User',
      icon: 'fas fa-check',
      onClick: (user) => {
        console.log('Activate user:', user);
      },
      disabled: (user) => user.user_status === 'active'
    },
    {
      label: 'Delete User',
      icon: 'fas fa-trash',
      onClick: (user) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          console.log('Delete user:', user);
        }
      },
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
    <EnhancedDataTable
      title="Users Management"
      data={users}
      columns={columns}
      actions={actions}
      loading={loading}
      error={error}
      
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
  );
};

export default EnhancedUsersTable;