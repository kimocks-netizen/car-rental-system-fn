import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../../components/booking/BookingForm';
import PaymentForm from '../../components/booking/PaymentForm';
import CarPreview from '../../components/cars/CarPreview';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Booking Details, 2: Payment
  const [bookingDetails, setBookingDetails] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/cars/${carId}`);
      
      if (!response.ok) {
        throw new Error('Car not found');
      }
      
      const result = await response.json();
      setCar(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = (bookingData) => {
    setBookingDetails(bookingData);
    setStep(2);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      setProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const token = localStorage.getItem('token');
      const bookingPayload = {
        car_id: parseInt(carId),
        start_date: bookingDetails.startDate,
        end_date: bookingDetails.endDate,
        pickup_location: bookingDetails.pickupLocation,
        dropoff_location: bookingDetails.dropoffLocation,
        total_cost: bookingDetails.totalCost,
        payment_details: {
          card_last_four: paymentData.cardNumber.slice(-4),
          cardholder_name: paymentData.cardholderName
        }
      };

      const response = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const result = await response.json();
      
      // Redirect to booking confirmation
      navigate(`/booking-confirmation/${result.data.id}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    setStep(1);
    setError(null);
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
            <h3 className="mt-3">Loading car details...</h3>
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
        {/* Progress Steps */}
        <div className="row mb-4">
          <div className="col-12">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: '15px 30px',
                borderRadius: '25px',
                border: '2px solid #dc3545'
              }}>
                <div style={{
                  backgroundColor: step >= 1 ? '#dc3545' : '#666',
                  color: 'white',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}>
                  1
                </div>
                <span style={{ color: 'white', marginRight: '20px' }}>Booking Details</span>
                
                <div style={{
                  width: '30px',
                  height: '2px',
                  backgroundColor: step >= 2 ? '#dc3545' : '#666',
                  marginRight: '20px'
                }}></div>
                
                <div style={{
                  backgroundColor: step >= 2 ? '#dc3545' : '#666',
                  color: 'white',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}>
                  2
                </div>
                <span style={{ color: 'white' }}>Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Car Preview */}
          <div className="col-lg-4 mb-4">
            <CarPreview car={car} mode="booking" />
          </div>

          {/* Booking/Payment Form */}
          <div className="col-lg-8">
            {step === 1 ? (
              <BookingForm
                car={car}
                onBookingSubmit={handleBookingSubmit}
                loading={processing}
              />
            ) : (
              <>
                <PaymentForm
                  onPaymentSubmit={handlePaymentSubmit}
                  totalAmount={bookingDetails.totalCost}
                  loading={processing}
                />
                <button
                  onClick={handleBackToBooking}
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #dc3545',
                    color: '#dc3545',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    marginTop: '15px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                  Back to Booking Details
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;