import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';

const CarPreview = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cars/${id}`);
      
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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        backgroundImage: 'url(/photos/hero2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center text-white">
          <div className="spinner-border text-light mb-3" role="status"></div>
          <h3>Loading car details...</h3>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        backgroundImage: 'url(/photos/hero2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <div className="alert alert-danger">
            <h4>Car Not Found</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.close()}>
              Close Preview
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
      <div className="container-fluid" style={{ padding: '10px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #dc3545',
              borderRadius: '15px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              
              {/* Header */}
              <div style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '20px',
                textAlign: 'center'
              }}>
                <h2 style={{ margin: 0, fontWeight: 'bold' }}>
                  {car.brand} {car.model}
                </h2>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
                  Client Preview - How this car appears to customers
                </p>
              </div>

              {/* Car Image */}
              <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                <img 
                  src={car.image_url || '/photos/car1.jpg'}
                  alt={`${car.brand} ${car.model}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = '/photos/car1.jpg';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: car.availability_status === 'available' ? '#28a745' : '#dc3545',
                  color: 'white',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {car.availability_status}
                </div>
              </div>

              {/* Car Details */}
              <div style={{ padding: '30px' }}>
                
                {/* Specifications Grid */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-2">
                    <div style={{ 
                      backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                      border: '1px solid #dc3545',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-calendar-alt" style={{ color: '#dc3545', fontSize: '1.3rem', marginBottom: '8px' }}></i>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>{car.year}</div>
                      <div style={{ color: '#ccc', fontSize: '0.85rem' }}>Year</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div style={{ 
                      backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                      border: '1px solid #dc3545',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-users" style={{ color: '#dc3545', fontSize: '1.3rem', marginBottom: '8px' }}></i>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>{car.capacity}</div>
                      <div style={{ color: '#ccc', fontSize: '0.85rem' }}>Seats</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div style={{ 
                      backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                      border: '1px solid #dc3545',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-gas-pump" style={{ color: '#dc3545', fontSize: '1.3rem', marginBottom: '8px' }}></i>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', textTransform: 'capitalize' }}>{car.fuel_type}</div>
                      <div style={{ color: '#ccc', fontSize: '0.85rem' }}>Fuel Type</div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div style={{ 
                      backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                      border: '1px solid #dc3545',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-cogs" style={{ color: '#dc3545', fontSize: '1.3rem', marginBottom: '8px' }}></i>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', textTransform: 'capitalize' }}>{car.transmission}</div>
                      <div style={{ color: '#ccc', fontSize: '0.85rem' }}>Transmission</div>
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
                      lineHeight: '1.5',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '12px',
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
                  padding: '18px',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ color: '#dc3545', fontSize: '2.2rem', fontWeight: 'bold' }}>
                      £{car.daily_rate}
                    </div>
                    <div style={{ color: '#ccc', fontSize: '1rem' }}>
                      per day
                    </div>
                  </div>
                  
                  <button
                    disabled
                    style={{
                      backgroundColor: '#28a745',
                      border: 'none',
                      color: 'white',
                      padding: '12px 30px',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: 'not-allowed',
                      opacity: 0.5
                    }}
                  >
                    <i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i>
                    Book Now
                  </button>
                </div>

                {/* Close Button */}
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <button
                    onClick={() => window.close()}
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid #6c757d',
                      color: '#6c757d',
                      padding: '10px 30px',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#6c757d';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6c757d';
                    }}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPreview;