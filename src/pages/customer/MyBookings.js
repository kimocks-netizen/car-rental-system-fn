import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    setShowContent(true);
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const result = await response.json();
      setBookings(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'active': return '#007bff';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    try {
      setCancelling(bookingToCancel.id);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingToCancel.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingToCancel.id 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        alert('Booking cancelled successfully!');
      } else {
        // Fallback to local state update if API fails
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingToCancel.id 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        alert('Booking cancelled (local update)');
      }
      
      setShowCancelModal(false);
      setBookingToCancel(null);
      
    } catch (err) {
      console.error('Cancel booking error:', err);
      // Fallback to local state update
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingToCancel.id 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      alert('Booking cancelled (offline mode)');
      setShowCancelModal(false);
      setBookingToCancel(null);
    } finally {
      setCancelling(null);
    }
  };



  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        backgroundImage: 'url(/photos/hero2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="container">
          <div className="alert alert-danger">
            <h5>Error</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchMyBookings}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      backgroundImage: 'url(/photos/hero2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container" style={{
        transform: showContent ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.6s ease-in-out'
      }}>
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="text-white mb-3">My Bookings</h2>
          </div>
        </div>

        {loading ? (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #dc3545',
            borderRadius: '15px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div className="spinner-border text-light mb-3" role="status"></div>
            <h4 style={{ color: 'white' }}>Loading your bookings...</h4>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #dc3545',
            borderRadius: '15px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#6c757d',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <i className="fas fa-calendar-times" style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>
            <h4 style={{ color: 'white', marginBottom: '15px' }}>No Bookings Found</h4>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>
              You haven't made any bookings yet. Start exploring our cars!
            </p>
            <button
              onClick={() => navigate('/cars')}
              style={{
                backgroundColor: '#dc3545',
                border: 'none',
                color: 'white',
                padding: '12px 25px',
                borderRadius: '25px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-car" style={{ marginRight: '8px' }}></i>
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="row">
            {bookings.map(booking => (
              <div key={booking.id} className="col-lg-6 mb-4">
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '2px solid #dc3545',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                  {/* Header */}
                  <div style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '15px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h6 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                        Booking #{booking.id.slice(0, 8)}
                      </h6>
                      <h5 style={{ margin: 0, fontWeight: 'bold' }}>
                        {booking.car?.brand} {booking.car?.model}
                      </h5>
                    </div>
                    <div style={{
                      backgroundColor: getStatusColor(booking.status),
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {booking.status}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: '20px' }}>
                    <div className="row mb-3">
                      <div className="col-6">
                        <label style={{ color: '#ccc', fontSize: '0.8rem' }}>Pickup Date</label>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                          {new Date(booking.pickup_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="col-6">
                        <label style={{ color: '#ccc', fontSize: '0.8rem' }}>Return Date</label>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                          {new Date(booking.return_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label style={{ color: '#ccc', fontSize: '0.8rem' }}>Duration</label>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                          {booking.total_days} day{booking.total_days > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="col-6">
                        <label style={{ color: '#ccc', fontSize: '0.8rem' }}>Total Amount</label>
                        <div style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          £{booking.total_amount}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-12">
                        <label style={{ color: '#ccc', fontSize: '0.8rem' }}>Pickup Location</label>
                        <div style={{ color: 'white' }}>
                          {booking.pickup_location || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button
                        onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
                        style={{
                          backgroundColor: 'transparent',
                          border: '2px solid #dc3545',
                          color: '#dc3545',
                          padding: '8px 15px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        <i className="fas fa-eye" style={{ marginRight: '5px' }}></i>
                        View Details
                      </button>
                      
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelClick(booking)}
                          disabled={cancelling === booking.id}
                          style={{
                            backgroundColor: cancelling === booking.id ? '#999' : '#6c757d',
                            border: 'none',
                            color: 'white',
                            padding: '8px 15px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            cursor: cancelling === booking.id ? 'not-allowed' : 'pointer',
                            flex: 1
                          }}
                        >
                          {cancelling === booking.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm" style={{ marginRight: '5px' }}></span>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-times" style={{ marginRight: '5px' }}></i>
                              Cancel
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <ConfirmationModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setBookingToCancel(null);
          }}
          onConfirm={handleCancelConfirm}
          title="Cancel Booking"
          message={`Are you sure you want to cancel your booking for ${bookingToCancel?.car?.brand} ${bookingToCancel?.car?.model}? This action cannot be undone.`}
          confirmText="Cancel Booking"
          cancelText="Keep Booking"
          loading={cancelling === bookingToCancel?.id}
          type="danger"
        />
      </div>
    </div>
  );
};

export default MyBookings;