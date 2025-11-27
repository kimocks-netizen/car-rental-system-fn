import React from 'react';
import useFrontendTableData from '../hooks/useFrontendTableData';
import EnhancedDataTable from './common/EnhancedDataTable';
import Badge from './common/Badge';

const EnhancedBookingsTable = ({ apiEndpoint = '/api/admin/bookings' }) => {
  // Fetch function for bookings with customer and car data
  const fetchBookings = async () => {
    const [bookingsResponse, carsResponse, usersResponse] = await Promise.all([
      fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL || 'http://localhost:8000'}${apiEndpoint}?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL || 'http://localhost:8000'}/api/cars?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL || 'http://localhost:8000'}/api/admin/users?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
    ]);
    
    const [bookingsResult, carsResult, usersResult] = await Promise.all([
      bookingsResponse.json(),
      carsResponse.json(), 
      usersResponse.json()
    ]);
    
    if (bookingsResult.success && carsResult.success && usersResult.success) {
      const bookings = bookingsResult.data.bookings || bookingsResult.data;
      const cars = carsResult.data.cars || carsResult.data;
      const users = usersResult.data.users || usersResult.data;
      
      // Create lookup maps
      const carMap = {};
      const userMap = {};
      
      cars.forEach(car => {
        carMap[car.id] = `${car.brand} ${car.model}`;
      });
      
      users.forEach(user => {
        userMap[user.id] = user.full_name || user.email;
      });
      
      // Enhance bookings with car and user names
      return bookings.map(booking => ({
        ...booking,
        customer_name: userMap[booking.user_id] || 'Unknown Customer',
        car_name: carMap[booking.car_id] || 'Unknown Car'
      }));
    }
    throw new Error('Failed to fetch bookings data');
  };

  const {
    data: bookings,
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
  } = useFrontendTableData(fetchBookings, {}, { field: 'created_at', direction: 'desc' });

  // Table columns configuration
  const columns = [
    {
      key: 'id',
      header: 'Booking ID',
      sortable: true,
      render: (value) => (
        <span className="font-monospace">{value?.slice(0, 8)}...</span>
      )
    },
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true
    },
    {
      key: 'car_name',
      header: 'Car',
      sortable: true
    },
    {
      key: 'pickup_date',
      header: 'Pickup Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'return_date',
      header: 'Return Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'total_amount',
      header: 'Total Amount',
      sortable: true,
      render: (value) => `$${value}`
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => <Badge variant={value}>{value}</Badge>
    },
    {
      key: 'created_at',
      header: 'Booked On',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Actions configuration
  const actions = [
    {
      label: 'View Details',
      icon: 'fas fa-eye',
      onClick: (booking) => {
        console.log('View booking:', booking);
      }
    },
    {
      label: 'Confirm Booking',
      icon: 'fas fa-check',
      onClick: (booking) => {
        console.log('Confirm booking:', booking);
      },
      disabled: (booking) => booking.status !== 'pending'
    },
    {
      label: 'Cancel Booking',
      icon: 'fas fa-times',
      onClick: (booking) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
          console.log('Cancel booking:', booking);
        }
      },
      disabled: (booking) => ['cancelled', 'completed'].includes(booking.status)
    }
  ];

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  ];

  // Sort options
  const sortOptions = [
    { value: 'created_at-desc', label: 'Newest First' },
    { value: 'created_at-asc', label: 'Oldest First' },
    { value: 'start_date-desc', label: 'Start Date: Latest First' },
    { value: 'start_date-asc', label: 'Start Date: Earliest First' },
    { value: 'total_amount-desc', label: 'Amount: High to Low' },
    { value: 'total_amount-asc', label: 'Amount: Low to High' },
    { value: 'customer_name-asc', label: 'Customer: A to Z' },
    { value: 'customer_name-desc', label: 'Customer: Z to A' }
  ];

  return (
    <EnhancedDataTable
      title="Bookings Management"
      data={bookings}
      columns={columns}
      actions={actions}
      loading={loading}
      error={error}
      
      // Search
      searchTerm={searchTerm}
      onSearch={handleSearch}
      searchPlaceholder="Search by customer name, booking ID..."
      
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

export default EnhancedBookingsTable;