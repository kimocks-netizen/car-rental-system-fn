import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingForm = ({ car, onSubmit }) => {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const calculateDays = () => {
    if (pickupDate && returnDate) {
      const diffTime = Math.abs(returnDate - pickupDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateCost = () => {
    const days = calculateDays();
    const rentalCost = days * car.daily_rate;
    const deposit = rentalCost * 0.3; // 30% deposit
    return { days, rentalCost, deposit, total: rentalCost + deposit };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickupDate && returnDate && agreed) {
      const cost = calculateCost();
      onSubmit({
        pickupDate,
        returnDate,
        ...cost
      });
    }
  };

  const cost = calculateCost();

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Book This Car</h4>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Pickup Date</label>
              <DatePicker
                selected={pickupDate}
                onChange={setPickupDate}
                minDate={new Date()}
                className="form-control"
                placeholderText="Select pickup date"
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Return Date</label>
              <DatePicker
                selected={returnDate}
                onChange={setReturnDate}
                minDate={pickupDate || new Date()}
                className="form-control"
                placeholderText="Select return date"
                required
              />
            </div>
          </div>

          {cost.days > 0 && (
            <div className="card bg-light mb-3">
              <div className="card-body">
                <h5>Cost Breakdown</h5>
                <div className="d-flex justify-content-between">
                  <span>Rental ({cost.days} days × ${car.daily_rate})</span>
                  <span>${cost.rentalCost}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Deposit (30%)</span>
                  <span>${cost.deposit}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>${cost.total}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
            />
            <label className="form-check-label" htmlFor="terms">
              I agree to the terms and conditions
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={!pickupDate || !returnDate || !agreed}
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;