import React, { useState, useEffect } from 'react';

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  const fetchAvailableCars = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/cars/available');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      
      const result = await response.json();
      setCars(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (car) => {
    // Navigate to booking page with car ID
    window.location.href = `/booking/${car.id}`;
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
            <h3 className="mt-3">Loading available cars...</h3>
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
            <h5>Error loading cars</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchAvailableCars}>Retry</button>
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
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="text-white mb-2">Available Cars for Rent</h1>
            <p className="text-light">Choose from our premium fleet of vehicles</p>
          </div>
        </div>

        {cars.length === 0 ? (
          <div className="text-center text-white">
            <h4>No cars available at the moment</h4>
            <p>Please check back later or contact us for assistance.</p>
          </div>
        ) : (
          <div className="row">
            {cars.map(car => (
              <div key={car.id} className="col-lg-4 col-md-6 mb-4">
                <CarCard car={car} onBookNow={handleBookNow} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CarCard = ({ car, onBookNow }) => {
  const defaultImage = '/photos/car1.jpg';
  
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
        <h5 style={{ color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>
          {car.brand} {car.model}
        </h5>
        
        <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px' }}>
          <div className="row">
            <div className="col-6">
              <i className="fas fa-calendar-alt me-2" style={{ color: '#dc3545' }}></i>
              {car.year}
            </div>
            <div className="col-6">
              <i className="fas fa-users me-2" style={{ color: '#dc3545' }}></i>
              {car.capacity} seats
            </div>
            <div className="col-6 mt-2">
              <i className="fas fa-gas-pump me-2" style={{ color: '#dc3545' }}></i>
              {car.fuel_type}
            </div>
            <div className="col-6 mt-2">
              <i className="fas fa-cogs me-2" style={{ color: '#dc3545' }}></i>
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
        </div>
      </div>
    </div>
  );
};

export default AvailableCars;