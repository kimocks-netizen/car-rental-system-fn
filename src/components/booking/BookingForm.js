import React, { useState } from 'react';

const BookingForm = ({ car, onBookingSubmit, loading }) => {
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: ''
  });
  const [errors, setErrors] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [days, setDays] = useState(0);

  const calculateCost = (startDate, endDate) => {
    if (!startDate || !endDate) return { days: 0, total: 0 };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { days: 0, total: 0 };
    
    const total = diffDays * car.daily_rate;
    return { days: diffDays, total };
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Recalculate cost when dates change
    if (field === 'startDate' || field === 'endDate') {
      const newData = { ...bookingData, [field]: value };
      const { days: newDays, total: newTotal } = calculateCost(newData.startDate, newData.endDate);
      setDays(newDays);
      setTotalCost(newTotal);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];
    
    if (!bookingData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (bookingData.startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }
    
    if (!bookingData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (bookingData.endDate <= bookingData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!bookingData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }
    
    if (!bookingData.dropoffLocation.trim()) {
      newErrors.dropoffLocation = 'Drop-off location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onBookingSubmit({ ...bookingData, totalCost, days });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #dc3545',
      borderRadius: '15px',
      padding: '30px',
      marginTop: '110px'
    }}>
      <h4 style={{ color: 'white', marginBottom: '20px' }}>
        <i className="fas fa-calendar-alt" style={{ marginRight: '10px', color: '#dc3545' }}></i>
        Booking Details
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label style={{ color: 'white', marginBottom: '8px' }}>Pickup Date</label>
            <input
              type="date"
              className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
              value={bookingData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              min={today}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white',
                colorScheme: 'dark'
              }}
            />
            {errors.startDate && (
              <div className="invalid-feedback">{errors.startDate}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label style={{ color: 'white', marginBottom: '8px' }}>Return Date</label>
            <input
              type="date"
              className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
              value={bookingData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={bookingData.startDate || today}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white',
                colorScheme: 'dark'
              }}
            />
            {errors.endDate && (
              <div className="invalid-feedback">{errors.endDate}</div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label style={{ color: 'white', marginBottom: '8px' }}>Pickup Location</label>
            <select
              className={`form-control ${errors.pickupLocation ? 'is-invalid' : ''}`}
              value={bookingData.pickupLocation}
              onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white'
              }}
            >
              <option value="">Select pickup location</option>
              <option value="London City Center">London City Center</option>
              <option value="Heathrow Airport">Heathrow Airport</option>
              <option value="Gatwick Airport">Gatwick Airport</option>
              <option value="Manchester Airport">Manchester Airport</option>
              <option value="Birmingham City Center">Birmingham City Center</option>
            </select>
            {errors.pickupLocation && (
              <div className="invalid-feedback">{errors.pickupLocation}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label style={{ color: 'white', marginBottom: '8px' }}>Drop-off Location</label>
            <select
              className={`form-control ${errors.dropoffLocation ? 'is-invalid' : ''}`}
              value={bookingData.dropoffLocation}
              onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white'
              }}
            >
              <option value="">Select drop-off location</option>
              <option value="London City Center">London City Center</option>
              <option value="Heathrow Airport">Heathrow Airport</option>
              <option value="Gatwick Airport">Gatwick Airport</option>
              <option value="Manchester Airport">Manchester Airport</option>
              <option value="Birmingham City Center">Birmingham City Center</option>
            </select>
            {errors.dropoffLocation && (
              <div className="invalid-feedback">{errors.dropoffLocation}</div>
            )}
          </div>
        </div>

        {days > 0 && (
          <div style={{
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid #dc3545',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <div className="row text-white">
              <div className="col-md-4">
                <strong>Duration:</strong> {days} day{days > 1 ? 's' : ''}
              </div>
              <div className="col-md-4">
                <strong>Daily Rate:</strong> £{car.daily_rate}
              </div>
              <div className="col-md-4">
                <strong>Total Cost:</strong> £{totalCost}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || totalCost === 0}
          style={{
            backgroundColor: totalCost === 0 ? '#666' : '#dc3545',
            border: 'none',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '1rem',
            width: '100%',
            transition: 'all 0.3s ease',
            cursor: (loading || totalCost === 0) ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!loading && totalCost > 0) {
              e.target.style.backgroundColor = '#c82333';
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && totalCost > 0) {
              e.target.style.backgroundColor = '#dc3545';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="fas fa-arrow-right" style={{ marginRight: '8px' }}></i>
              Proceed to Payment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;