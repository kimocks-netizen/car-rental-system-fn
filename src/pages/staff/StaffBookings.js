import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/DataTable';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const StaffBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const [bookingsResponse, carsResponse] = await Promise.all([
        fetch('http://localhost:8000/api/bookings', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:8000/api/cars', {
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
        
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setCars(carsLookup);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (booking, newStatus) => {
    console.log('📝 handleStatusUpdate called');
    console.log('Booking:', booking);
    console.log('New Status:', newStatus);
    setSelectedBooking({ ...booking, newStatus });
    setModalType(newStatus);
    setShowModal(true);
    console.log('✅ Modal should now be visible');
  };

  const confirmStatusUpdate = async () => {
    console.log('🚀 confirmStatusUpdate called');
    console.log('Selected booking:', selectedBooking);
    
    try {
      const url = `http://localhost:8000/api/bookings/${selectedBooking.id}/status`;
      const payload = { status: selectedBooking.newStatus };
      
      console.log('📡 Making API call to:', url);
      console.log('📦 Payload:', payload);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);

      if (response.ok) {
        console.log('✅ API call successful, updating local state');
        setBookings(bookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: selectedBooking.newStatus }
            : booking
        ));
      } else {
        console.log('❌ API call failed');
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setError('Failed to update booking status');
      }
    } catch (error) {
      console.error('💥 Error updating booking:', error);
      setError('Error updating booking status');
    } finally {
      console.log('🏁 Closing modal and resetting state');
      setShowModal(false);
      setSelectedBooking(null);
    }
  };

  const bookingColumns = [
    { 
      key: 'id', 
      header: 'Booking ID',
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
      render: (status) => {
        const getStatusColor = (status) => {
          switch(status) {
            case 'pending': return '#ff8c00';
            case 'confirmed': return '#28a745';
            case 'active': return '#007bff';
            case 'completed': return '#6c757d';
            case 'cancelled': return '#dc3545';
            default: return '#ffc107';
          }
        };
        return (
          <span style={{
            backgroundColor: getStatusColor(status),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {status}
          </span>
        );
      }
    },
    { 
      key: 'total_amount', 
      header: 'Amount',
      render: (value) => `£${value}`
    },
    { 
      key: 'pickup_date', 
      header: 'Pickup Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'return_date', 
      header: 'Return Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'pickup_location', 
      header: 'Pickup Location',
      render: (value) => value || 'Not specified'
    },
    { 
      key: 'dropoff_location', 
      header: 'Return Location',
      render: (value) => value || 'Not specified'
    }
  ];

  const getBookingActions = () => {
    return [
      {
        label: <i className="fas fa-check" style={{color: '#28a745'}}></i>,
        className: 'btn-link',
        onClick: (booking) => {
          if (booking.status === 'pending') {
            handleStatusUpdate(booking, 'confirmed');
          }
        },
        title: 'Approve Booking',
        disabled: (booking) => booking.status !== 'pending'
      },
      {
        label: <i className="fas fa-times" style={{color: '#dc3545'}}></i>,
        className: 'btn-link', 
        onClick: (booking) => {
          if (booking.status === 'pending' || booking.status === 'confirmed') {
            handleStatusUpdate(booking, 'cancelled');
          }
        },
        title: 'Cancel Booking',
        disabled: (booking) => booking.status !== 'pending' && booking.status !== 'confirmed'
      },
      {
        label: <i className="fas fa-play" style={{color: '#007bff'}}></i>,
        className: 'btn-link',
        onClick: (booking) => {
          if (booking.status === 'confirmed') {
            handleStatusUpdate(booking, 'active');
          }
        },
        title: 'Start Rental',
        disabled: (booking) => booking.status !== 'confirmed'
      }
    ];
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="text-center text-white">
            <h3>Loading bookings...</h3>
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
            <h5>Error loading bookings</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchBookings}>Retry</button>
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
            <h2 className="text-white mb-4">Booking Management</h2>
            <DataTable 
              title={`All Bookings (${bookings.length})`}
              data={bookings}
              columns={bookingColumns}
              actions={getBookingActions()}
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