import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Booking not found');
      }
      
      const result = await response.json();
      setBooking(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <div className="text-center text-white">
            <div className="spinner-border text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <h3 className="mt-3">Loading booking details...</h3>
          </div>
        </div>
      </div>
    );
  }

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
            <button className="btn btn-primary" onClick={() => navigate('/cars')}>
              Back to Cars
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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Success Header */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #28a745',
              borderRadius: '15px',
              padding: '30px',
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                backgroundColor: '#28a745',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <i className="fas fa-check" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ color: 'white', marginBottom: '10px' }}>Booking Confirmed!</h2>
              <p style={{ color: '#ccc', fontSize: '1.1rem' }}>
                Your car rental has been successfully booked.
              </p>
            </div>

            {/* Booking Details */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #dc3545',
              borderRadius: '15px',
              padding: '30px'
            }}>
              <h4 style={{ color: 'white', marginBottom: '20px' }}>
                <i className="fas fa-file-alt" style={{ marginRight: '10px', color: '#dc3545' }}></i>
                Booking Details
              </h4>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Booking ID</label>
                  <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    #{booking?.id}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Status</label>
                  <div style={{
                    color: '#28a745',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {booking?.status}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Car</label>
                  <div style={{ color: 'white', fontSize: '1.1rem' }}>
                    {booking?.car?.brand} {booking?.car?.model}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Rental Amount</label>
                  <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    £{booking?.rental_amount}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Security Deposit</label>
                  <div style={{ color: '#ffc107', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    £{booking?.deposit_amount}
                  </div>
                  <small style={{ color: '#ccc', display: 'block' }}>Refundable if no damage</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Total Amount</label>
                  <div style={{ color: '#dc3545', fontSize: '1.3rem', fontWeight: 'bold' }}>
                    £{booking?.total_amount}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Pickup Date</label>
                  <div style={{ color: 'white', fontSize: '1.1rem' }}>
                    {new Date(booking?.pickup_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Return Date</label>
                  <div style={{ color: 'white', fontSize: '1.1rem' }}>
                    {new Date(booking?.return_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Pickup Location</label>
                  <div style={{ color: 'white', fontSize: '1.1rem' }}>
                    {booking?.pickup_location}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Drop-off Location</label>
                  <div style={{ color: 'white', fontSize: '1.1rem' }}>
                    {booking?.dropoff_location}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid #dc3545',
                borderRadius: '10px',
                padding: '15px',
                marginTop: '20px'
              }}>
                <h6 style={{ color: 'white', marginBottom: '10px' }}>Important Information:</h6>
                <ul style={{ color: '#ccc', marginBottom: 0 }}>
                  <li>Please arrive 15 minutes before your pickup time</li>
                  <li>Bring a valid driving license and credit card</li>
                  <li>Check your email for detailed pickup instructions</li>
                  <li>Contact us at +44 123 456 7890 for any questions</li>
                </ul>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  onClick={() => navigate('/customer/dashboard')}
                  style={{
                    backgroundColor: '#dc3545',
                    border: 'none',
                    color: 'white',
                    padding: '12px 25px',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  <i className="fas fa-tachometer-alt" style={{ marginRight: '8px' }}></i>
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/cars')}
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #dc3545',
                    color: '#dc3545',
                    padding: '12px 25px',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  <i className="fas fa-car" style={{ marginRight: '8px' }}></i>
                  Browse More Cars
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;