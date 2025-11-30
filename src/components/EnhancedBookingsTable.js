import React, { useState } from 'react';
import useFrontendTableData from '../hooks/useFrontendTableData';
import EnhancedDataTable from './common/EnhancedDataTable';
import Badge from './common/Badge';
import ConfirmationModal from './common/ConfirmationModal';
import { API_BASE_URL } from '../utils/api';

const EnhancedBookingsTable = ({ apiEndpoint = '/admin/bookings' }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  // Fetch function for bookings with customer and car data
  const fetchBookings = async () => {
    const [bookingsResponse, carsResponse, usersResponse] = await Promise.all([
      fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL}${apiEndpoint}?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL}/cars?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL}/admin/users?limit=1000`, {
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

  const handleStatusUpdate = (booking, newStatus) => {
    setSelectedBooking({ ...booking, newStatus });
    setModalType(newStatus);
    setShowModal(true);
  };

  const confirmStatusUpdate = async () => {
    try {
      const payload = { 
        status: selectedBooking.newStatus,
        ...(selectedBooking.newStatus === 'cancelled' && { cancelled_by: 'admin' })
      };
      
      const response = await fetch(`${API_BASE_URL}/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        refresh();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setShowModal(false);
      setSelectedBooking(null);
    }
  };

  // Actions configuration
  const actions = [
    {
      label: 'Approve Booking',
      icon: 'fas fa-check',
      onClick: (booking) => handleStatusUpdate(booking, 'confirmed'),
      disabled: (booking) => booking.status !== 'pending'
    },
    {
      label: 'Cancel Booking',
      icon: 'fas fa-times',
      onClick: (booking) => handleStatusUpdate(booking, 'cancelled'),
      disabled: (booking) => ['cancelled', 'completed'].includes(booking.status)
    },
    {
      label: 'Start Rental',
      icon: 'fas fa-play',
      onClick: (booking) => handleStatusUpdate(booking, 'active'),
      disabled: (booking) => booking.status !== 'confirmed'
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
    <>
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

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmStatusUpdate}
        title={`Update Booking Status`}
        message={`Are you sure you want to ${modalType} this booking?`}
        type={modalType === 'cancelled' ? 'danger' : 'primary'}
      />
    </>
  );
};

export default EnhancedBookingsTable;