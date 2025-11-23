import React, { useState } from 'react';

const PaymentForm = ({ onPaymentSubmit, totalAmount, loading }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  const validateCardNumber = (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '');
    return digits.length === 16;
  };

  const validateCVV = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };

  const validateExpiryDate = (expiryDate) => {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;
    
    return true;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\D/g, '').length > 16) return;
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      if (formattedValue.replace(/\D/g, '').length > 4) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return;
    }
    
    setPaymentData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    if (!validateCardNumber(paymentData.cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!validateExpiryDate(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date or card expired';
    }
    
    if (!validateCVV(paymentData.cvv)) {
      newErrors.cvv = 'CVV must be 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onPaymentSubmit(paymentData);
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #dc3545',
      borderRadius: '15px',
      padding: '30px',
      marginTop: '20px'
    }}>
      <h4 style={{ color: 'white', marginBottom: '20px' }}>
        <i className="fas fa-credit-card" style={{ marginRight: '10px', color: '#dc3545' }}></i>
        Payment Details
      </h4>
      
      <div style={{
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h5 style={{ margin: 0 }}>Total Amount: £{totalAmount}</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label style={{ color: 'white', marginBottom: '8px' }}>Cardholder Name</label>
          <input
            type="text"
            className={`form-control ${errors.cardholderName ? 'is-invalid' : ''}`}
            value={paymentData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="John Doe"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #555',
              color: 'white'
            }}
          />
          {errors.cardholderName && (
            <div className="invalid-feedback">{errors.cardholderName}</div>
          )}
        </div>

        <div className="mb-3">
          <label style={{ color: 'white', marginBottom: '8px' }}>Card Number</label>
          <input
            type="text"
            className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
            value={paymentData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            placeholder="1234 5678 9012 3456"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #555',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '1.1rem'
            }}
          />
          {errors.cardNumber && (
            <div className="invalid-feedback">{errors.cardNumber}</div>
          )}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label style={{ color: 'white', marginBottom: '8px' }}>Expiry Date</label>
            <input
              type="text"
              className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
              value={paymentData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="MM/YY"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '1.1rem'
              }}
            />
            {errors.expiryDate && (
              <div className="invalid-feedback">{errors.expiryDate}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label style={{ color: 'white', marginBottom: '8px' }}>CVV</label>
            <input
              type="text"
              className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
              value={paymentData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              placeholder="123"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #555',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '1.1rem'
              }}
            />
            {errors.cvv && (
              <div className="invalid-feedback">{errors.cvv}</div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#dc3545',
            border: 'none',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '1rem',
            width: '100%',
            transition: 'all 0.3s ease',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#c82333';
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#dc3545';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Processing Payment...
            </>
          ) : (
            <>
              <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>
              Complete Payment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;