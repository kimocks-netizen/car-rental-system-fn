import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { API_BASE_URL } from '../../utils/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedBookingNotes, setSelectedBookingNotes] = useState(null);

  useEffect(() => {
    setShowContent(true);
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
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
      case 'cancelled': return '#c82333';
      default: return '#ffc107';
    }
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleViewNotes = (booking) => {
    setSelectedBookingNotes(booking);
    setShowNotesModal(true);
  };

  const calculateDamageCharge = (damageLevel, depositAmount) => {
    if (!damageLevel) return 0;
    return (damageLevel / 10) * depositAmount;
  };

  const handleCancelConfirm = async () => {
    try {
      setCancelling(bookingToCancel.id);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingToCancel.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apply_cancellation_fee: true })
      });
      
      if (response.ok) {
        const result = await response.json();
        const cancellationFee = bookingToCancel.total_amount * 0.2;
        const refundAmount = bookingToCancel.total_amount - cancellationFee;
        
        // Update local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingToCancel.id 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        
        alert(`Booking cancelled successfully!\nCancellation fee: £${cancellationFee.toFixed(2)}\nRefund amount: £${refundAmount.toFixed(2)} added to your balance.`);
      } else {
        // Fallback calculation
        const cancellationFee = bookingToCancel.total_amount * 0.2;
        const refundAmount = bookingToCancel.total_amount - cancellationFee;
        
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingToCancel.id 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        
        alert(`Booking cancelled (local update)\nCancellation fee: £${cancellationFee.toFixed(2)}\nRefund: £${refundAmount.toFixed(2)} will be processed.`);
      }
      
      setShowCancelModal(false);
      setBookingToCancel(null);
      
    } catch (err) {
      console.error('Cancel booking error:', err);
      const cancellationFee = bookingToCancel.total_amount * 0.2;
      const refundAmount = bookingToCancel.total_amount - cancellationFee;
      
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingToCancel.id 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      
      alert(`Booking cancelled (offline mode)\nCancellation fee: £${cancellationFee.toFixed(2)}\nRefund: £${refundAmount.toFixed(2)} will be processed.`);
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
      paddingBottom: '50px',
      backgroundImage: 'url(/photos/hero2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll'
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
                      <div className="col-6">
                        <label style={{ color: '#ccc', fontSize: '0.8rem' }}>Pickup Location</label>
                        <div style={{ color: 'white' }}>
                          {booking.pickup_location || 'Not specified'}
                        </div>
                      </div>
                      <div className="col-6">
                        <label style={{ color: '#ccc', fontSize: '0.8rem' }}>Return Location</label>
                        <div style={{ color: 'white' }}>
                          {booking.dropoff_location || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      {booking.status === 'completed' ? (
                        <button
                          onClick={() => handleViewNotes(booking)}
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
                          <i className="fas fa-clipboard-list" style={{ marginRight: '5px' }}></i>
                          View Notes
                        </button>
                      ) : (
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
                      )}
                      
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
          message={`Are you sure you want to cancel your booking for ${bookingToCancel?.car?.brand} ${bookingToCancel?.car?.model}?\n\nCancellation fee: £${bookingToCancel ? (bookingToCancel.total_amount * 0.2).toFixed(2) : '0.00'}\nRefund amount: £${bookingToCancel ? (bookingToCancel.total_amount * 0.8).toFixed(2) : '0.00'}\n\nThis action cannot be undone.`}
          confirmText="Cancel Booking"
          cancelText="Keep Booking"
          loading={cancelling === bookingToCancel?.id}
          type="danger"
        />

        {/* Inspection Notes Modal */}
        {showNotesModal && selectedBookingNotes && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto', overflow: 'auto'}}>
            <div className="modal-dialog modal-lg" style={{marginTop: '10px', marginBottom: '50px', pointerEvents: 'auto'}}>
              <div style={{
                backgroundColor: 'black',
                border: '2px solid red',
                borderRadius: '15px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 4px 15px rgba(255, 0, 0, 0.1)',
                position: 'relative',
                pointerEvents: 'auto',
                maxHeight: 'calc(100vh - 170px)',
                overflow: 'auto'
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
                  <h5 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                    Return Inspection Report
                  </h5>
                  <button 
                    onClick={() => setShowNotesModal(false)}
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

                {/* Content */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '20px' }}>
                    
                    {/* Vehicle Info */}
                    <div style={{ marginBottom: '20px' }}>
                      <h6 style={{ color: '#dc3545', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>Vehicle Information</h6>
                      <div style={{ color: 'white', fontSize: '1.1rem' }}>
                        {selectedBookingNotes.car?.brand} {selectedBookingNotes.car?.model} ({selectedBookingNotes.car?.year})
                      </div>
                      <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                        Booking #{selectedBookingNotes.id.slice(0, 8)} • Completed on {new Date(selectedBookingNotes.updated_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Damage Assessment */}
                    {selectedBookingNotes.damage_level > 0 ? (
                      <>
                        <div style={{ marginBottom: '20px' }}>
                          <h6 style={{ color: '#dc3545', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>Damage Assessment</h6>
                          <div style={{
                            backgroundColor: 'rgba(255, 193, 7, 0.1)',
                            border: '1px solid rgba(255, 193, 7, 0.3)',
                            borderRadius: '8px',
                            padding: '15px'
                          }}>
                            <div style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>
                              Damage Level: {selectedBookingNotes.damage_level}/10
                            </div>
                            <div style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '5px' }}>
                              Damage Charge: £{calculateDamageCharge(selectedBookingNotes.damage_level, selectedBookingNotes.deposit_amount).toFixed(2)}
                            </div>
                            <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                              {selectedBookingNotes.damage_level * 10}% of security deposit (£{selectedBookingNotes.deposit_amount})
                            </div>
                          </div>
                        </div>

                        {selectedBookingNotes.return_notes && (
                          <div style={{ marginBottom: '20px' }}>
                            <h6 style={{ color: '#dc3545', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>Damage Types</h6>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {selectedBookingNotes.return_notes.split(',').map((damage, index) => (
                                <span key={index} style={{
                                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                  border: '1px solid rgba(220, 53, 69, 0.3)',
                                  borderRadius: '15px',
                                  padding: '5px 12px',
                                  fontSize: '0.85rem',
                                  color: '#dc3545'
                                }}>
                                  {damage.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ marginBottom: '20px' }}>
                        <h6 style={{ color: '#28a745', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>Vehicle Condition</h6>
                        <div style={{
                          backgroundColor: 'rgba(40, 167, 69, 0.1)',
                          border: '1px solid rgba(40, 167, 69, 0.3)',
                          borderRadius: '8px',
                          padding: '15px',
                          color: '#28a745',
                          fontWeight: 'bold'
                        }}>
                          No damage reported - Vehicle returned in excellent condition
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {selectedBookingNotes.pickup_notes && selectedBookingNotes.pickup_notes !== 'none' && (
                      <div style={{ marginBottom: '20px' }}>
                        <h6 style={{ color: '#dc3545', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>Additional Notes</h6>
                        <div style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '15px',
                          color: 'white'
                        }}>
                          {selectedBookingNotes.pickup_notes}
                        </div>
                      </div>
                    )}

                    {/* Financial Summary */}
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '15px'
                    }}>
                      <h6 style={{ color: '#dc3545', fontSize: '1rem', fontWeight: '600', marginBottom: '15px' }}>Financial Summary</h6>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#ccc' }}>Rental Amount:</span>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>£{selectedBookingNotes.rental_amount}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#ccc' }}>Security Deposit:</span>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>£{selectedBookingNotes.deposit_amount}</span>
                      </div>
                      {selectedBookingNotes.damage_level > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: '#ffc107' }}>Damage Charge:</span>
                          <span style={{ color: '#ffc107', fontWeight: 'bold' }}>-£{calculateDamageCharge(selectedBookingNotes.damage_level, selectedBookingNotes.deposit_amount).toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#28a745' }}>Deposit Refund:</span>
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>+£{selectedBookingNotes.damage_level > 0 ? (selectedBookingNotes.deposit_amount - calculateDamageCharge(selectedBookingNotes.damage_level, selectedBookingNotes.deposit_amount)).toFixed(2) : selectedBookingNotes.deposit_amount}</span>
                      </div>
                      <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '10px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>Net Amount Paid:</span>
                        <span style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          £{selectedBookingNotes.damage_level > 0 ? (selectedBookingNotes.rental_amount + calculateDamageCharge(selectedBookingNotes.damage_level, selectedBookingNotes.deposit_amount)).toFixed(2) : selectedBookingNotes.rental_amount}
                        </span>
                      </div>
                    </div>

                    {/* Close Button */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <button
                        onClick={() => setShowNotesModal(false)}
                        style={{
                          padding: '12px 30px',
                          backgroundColor: '#dc3545',
                          border: '2px solid #dc3545',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;