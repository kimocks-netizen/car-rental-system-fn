import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CarPreview = ({ car, onClose, isAdmin = false, mode = 'customer' }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const defaultImage = '/photos/car1.jpg';
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/photos/hero2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '140px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '15px 15px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h3 style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>
              {car.brand} {car.model}
            </h3>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '0.9rem', color: 'white' }}>
              {isAdmin ? 'Admin Preview - How customers see this car' : mode === 'booking' ? 'Selected Car' : 'Car Details'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid white',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #dc3545',
          borderRadius: '0 0 15px 15px',
          borderTop: 'none'
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
              backgroundColor: car.availability_status === 'available' ? '#28a745' : '#dc3545',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '15px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {car.availability_status}
            </div>
          </div>

          {/* Car Details */}
          <div style={{ padding: '20px' }}>
            
            {/* Specifications Grid */}
            <div className="row mb-3">
              <div className="col-6 mb-2">
                <div style={{ 
                  backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                  border: '1px solid #dc3545',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-calendar-alt" style={{ color: '#dc3545', fontSize: '1.2rem', marginBottom: '5px' }}></i>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{car.year}</div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Year</div>
                </div>
              </div>
              <div className="col-6 mb-2">
                <div style={{ 
                  backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                  border: '1px solid #dc3545',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-users" style={{ color: '#dc3545', fontSize: '1.2rem', marginBottom: '5px' }}></i>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{car.capacity}</div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Seats</div>
                </div>
              </div>
              <div className="col-6 mb-2">
                <div style={{ 
                  backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                  border: '1px solid #dc3545',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-gas-pump" style={{ color: '#dc3545', fontSize: '1.2rem', marginBottom: '5px' }}></i>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'capitalize' }}>{car.fuel_type}</div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Fuel</div>
                </div>
              </div>
              <div className="col-6 mb-2">
                <div style={{ 
                  backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                  border: '1px solid #dc3545',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-cogs" style={{ color: '#dc3545', fontSize: '1.2rem', marginBottom: '5px' }}></i>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'capitalize' }}>{car.transmission}</div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Trans</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div style={{ marginBottom: '20px' }}>
                <h6 style={{ color: 'white', marginBottom: '10px', fontSize: '1rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#dc3545', marginRight: '8px' }}></i>
                  Description
                </h6>
                <p style={{ 
                  color: '#ccc', 
                  lineHeight: '1.4',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  {car.description}
                </p>
              </div>
            )}

            {/* Price and Action */}
            <div style={{
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              border: '2px solid #dc3545',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ color: '#dc3545', fontSize: '2rem', fontWeight: 'bold' }}>
                  £{car.daily_rate}
                </div>
                <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  per day
                </div>
              </div>
              
              {mode !== 'booking' && (
                <button
                  disabled={isAdmin}
                  onClick={() => {
                    if (!isAdmin) {
                      if (isAuthenticated && user?.role === 'customer') {
                        navigate(`/booking/${car.id}`);
                      } else {
                        navigate('/login');
                      }
                    }
                  }}
                  style={{
                    backgroundColor: '#28a745',
                    border: 'none',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: isAdmin ? 'not-allowed' : 'pointer',
                    opacity: isAdmin ? 0.5 : 1
                  }}
                >
                  <i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i>
                  Book Now
                </button>
              )}
              
              {mode === 'booking' && (
                <div style={{ color: '#28a745', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                  Selected for Booking
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPreview;