import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car, onBookNow, onPreview, onShowCalendar }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const defaultImage = '/photos/car1.jpg';
  const isAvailable = (car.available_quantity || 1) > 0;
  
  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #dc3545',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    className="car-card h-100"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(220, 53, 69, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      
      {/* Car Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={car.image_url || defaultImage}
          alt={`${car.brand} ${car.model}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: (() => {
            const qty = car.available_quantity || 1;
            if (qty === 0) return '#dc3545'; // Red
            if (qty === 1) return '#dc3545'; // Red
            if (qty === 2) return '#ff8c00'; // Orange
            return '#28a745'; // Green
          })(),
          color: 'white',
          padding: '5px 10px',
          borderRadius: '15px',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {(() => {
            const qty = car.available_quantity || 1;
            if (qty === 0) return 'Sold Out';
            return `${qty} left`;
          })()}
        </div>
        
        {/* Preview Button */}
        {onPreview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(car);
            }}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
            title="Preview Car"
          >
            <i className="fas fa-eye"></i>
          </button>
        )}
      </div>

      {/* Car Details */}
      <div style={{ padding: '20px' }}>
        <h5 style={{ color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>
          {car.brand} {car.model}
        </h5>
        
        <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px' }}>
          <div className="row">
            <div className="col-6">
              <i className="fas fa-calendar-alt" style={{ color: '#dc3545', marginRight: '8px' }}></i>
              {car.year}
            </div>
            <div className="col-6">
              <i className="fas fa-users" style={{ color: '#dc3545', marginRight: '8px' }}></i>
              {car.capacity} seats
            </div>
            <div className="col-6 mt-2">
              <i className="fas fa-gas-pump" style={{ color: '#dc3545', marginRight: '8px' }}></i>
              {car.fuel_type}
            </div>
            <div className="col-6 mt-2">
              <i className="fas fa-cogs" style={{ color: '#dc3545', marginRight: '8px' }}></i>
              {car.transmission}
            </div>
          </div>
        </div>

        {car.description && (
          <p style={{ 
            color: '#aaa', 
            fontSize: '0.85rem', 
            marginBottom: '15px',
            lineHeight: '1.4'
          }}>
            {car.description.length > 100 
              ? `${car.description.substring(0, 100)}...` 
              : car.description
            }
          </p>
        )}

        {/* Price and Book Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <div>
            <div style={{ color: '#dc3545', fontSize: '1.5rem', fontWeight: 'bold' }}>
              £{car.daily_rate}
            </div>
            <div style={{ color: '#888', fontSize: '0.8rem' }}>
              per day
            </div>
          </div>
          
          {/* <div style={{ display: 'flex', gap: '10px' }}>
            {onPreview && (
              <button
                onClick={() => onPreview(car)}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid #dc3545',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#dc3545';
                }}
                title="Preview Car"
              >
                <i className="fas fa-eye"></i>
              </button>
            )}
            
            {onBookNow && (
              <button
                onClick={() => onBookNow(car)}
                style={{
                  backgroundColor: '#dc3545',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#c82333';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i>
                Book Now
              </button>
            )}
          </div> */}
          
          {onBookNow && (
            <button
              onClick={() => {
                if (!isAvailable) {
                  if (onShowCalendar) {
                    onShowCalendar(car);
                  }
                  return;
                }
                if (isAuthenticated) {
                  onBookNow(car);
                } else {
                  navigate('/login');
                }
              }}
              style={{
                backgroundColor: isAvailable ? '#dc3545' : '#6c757d',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                opacity: isAvailable ? 1 : 0.7
              }}
              onMouseEnter={(e) => {
                if (isAvailable) {
                  e.target.style.backgroundColor = '#c82333';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (isAvailable) {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              <i className={`fas ${isAvailable ? 'fa-calendar-check' : 'fa-calendar-times'}`} style={{ marginRight: '8px' }}></i>
              {isAvailable ? 'Book Now' : 'View Availability'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;