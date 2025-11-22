import React from 'react';

const BookingCard = ({ booking }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-warning',
      confirmed: 'bg-success',
      active: 'bg-primary',
      returned: 'bg-info',
      completed: 'bg-success',
      cancelled: 'bg-danger'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <h5 className="card-title">
              {booking.car?.brand} {booking.car?.model}
              {getStatusBadge(booking.status)}
            </h5>
            <p className="card-text">
              <strong>Pickup:</strong> {formatDate(booking.pickup_date)} <br />
              <strong>Return:</strong> {formatDate(booking.return_date)} <br />
              <strong>Duration:</strong> {booking.total_days} days
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <h4 className="text-primary">${booking.total_amount}</h4>
            <div className="btn-group-vertical">
              <button className="btn btn-outline-primary btn-sm">
                View Details
              </button>
              {booking.status === 'pending' && (
                <button className="btn btn-outline-danger btn-sm">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;