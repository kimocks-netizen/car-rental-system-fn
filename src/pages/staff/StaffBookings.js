import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EnhancedDataTable from '../../components/common/EnhancedDataTable';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Badge from '../../components/common/Badge';
import useFrontendTableData from '../../hooks/useFrontendTableData';
import { API_BASE_URL } from '../../utils/api';

const StaffBookings = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Fetch function for bookings
  const fetchBookings = async () => {
    const [bookingsResponse, carsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }),
      fetch(`${API_BASE_URL}/cars`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
    ]);

    if (bookingsResponse.ok && carsResponse.ok) {
      const bookingsResult = await bookingsResponse.json();
      const carsResult = await carsResponse.json();
      
      const bookingsData = bookingsResult.data?.bookings || bookingsResult.bookings || bookingsResult;
      const carsData = carsResult.data?.cars || carsResult.cars || carsResult;
      
      const carsLookup = {};
      carsData.forEach(car => {
        carsLookup[car.id] = `${car.brand} ${car.model}`;
      });
      
      setCars(carsLookup);
      return Array.isArray(bookingsData) ? bookingsData : [];
    }
    throw new Error('Failed to fetch bookings');
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
    sortConfig,
    handleSort,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refresh
  } = useFrontendTableData(fetchBookings, {}, { field: 'pickup_date', direction: 'desc' });

  const handleStatusUpdate = (booking, newStatus) => {
    setSelectedBooking({ ...booking, newStatus });
    setModalType(newStatus);
    setShowModal(true);
  };

  const confirmStatusUpdate = async () => {
    try {
      const payload = { 
        status: selectedBooking.newStatus,
        ...(selectedBooking.newStatus === 'cancelled' && { cancelled_by: 'staff' })
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
        refresh(); // Refresh the data
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setShowModal(false);
      setSelectedBooking(null);
    }
  };

  const bookingColumns = [
    { 
      key: 'id', 
      header: 'Booking ID',
      sortable: true,
      render: (id) => `#${id.slice(0, 8)}`
    },
    { 
      key: 'car_id', 
      header: 'Car',
      render: (carId) => cars[carId] || 'Unknown Car'
    },
    { 
      key: 'status', 
      header: 'Status',
      sortable: true,
      render: (status) => <Badge variant={status}>{status}</Badge>
    },
    { 
      key: 'total_amount', 
      header: 'Amount',
      sortable: true,
      render: (value) => `£${value}`
    },
    { 
      key: 'pickup_date', 
      header: 'Pickup Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'return_date', 
      header: 'Return Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'pickup_location', 
      header: 'Pickup Location',
      render: (value) => value || 'Not specified'
    }
  ];

  const getBookingActions = () => {
    return [
      {
        label: 'Approve Booking',
        icon: 'fas fa-check',
        onClick: (booking) => {
          handleStatusUpdate(booking, 'confirmed');
        },
        disabled: (booking) => booking.status !== 'pending'
      },
      {
        label: 'Cancel Booking',
        icon: 'fas fa-times',
        onClick: (booking) => {
          handleStatusUpdate(booking, 'cancelled');
        },
        disabled: (booking) => !['pending', 'confirmed'].includes(booking.status)
      },
      {
        label: 'Start Rental',
        icon: 'fas fa-play',
        onClick: (booking) => {
          handleStatusUpdate(booking, 'active');
        },
        disabled: (booking) => booking.status !== 'confirmed'
      }
    ];
  };

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
    { value: 'pickup_date-desc', label: 'Pickup Date: Latest First' },
    { value: 'pickup_date-asc', label: 'Pickup Date: Earliest First' },
    { value: 'return_date-desc', label: 'Return Date: Latest First' },
    { value: 'return_date-asc', label: 'Return Date: Earliest First' },
    { value: 'total_amount-desc', label: 'Amount: High to Low' },
    { value: 'total_amount-asc', label: 'Amount: Low to High' },
    { value: 'status-asc', label: 'Status: A to Z' },
    { value: 'status-desc', label: 'Status: Z to A' }
  ];

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4">Booking Management</h2>
            
            <EnhancedDataTable
              title="Booking Management"
              data={bookings}
              columns={bookingColumns}
              actions={getBookingActions()}
              loading={loading}
              error={error}
              
              // Search
              searchTerm={searchTerm}
              onSearch={handleSearch}
              searchPlaceholder="Search by booking ID, car, location..."
              
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
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmStatusUpdate}
        title={`Update Booking Status`}
        message={`Are you sure you want to ${modalType} this booking?`}
        type={modalType === 'cancelled' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default StaffBookings;