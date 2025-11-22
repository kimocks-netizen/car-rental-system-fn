import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img 
          src={car.image_url || '/price.png'} 
          className="card-img-top" 
          alt={`${car.brand} ${car.model}`}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{car.brand} {car.model}</h5>
          <p className="card-text">
            <small className="text-muted">{car.year} • {car.type}</small>
          </p>
          <p className="card-text">
            <i className="fas fa-users"></i> {car.capacity} seats • 
            <i className="fas fa-cog ms-2"></i> {car.transmission} • 
            <i className="fas fa-gas-pump ms-2"></i> {car.fuel_type}
          </p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              <span className="h5 text-primary">${car.daily_rate}/day</span>
              <Link 
                to={`/cars/${car.id}`} 
                className="btn btn-primary btn-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;