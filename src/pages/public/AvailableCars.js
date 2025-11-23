import React, { useState, useEffect } from 'react';
import CarCard from '../../components/cars/CarCard';
import CarPreview from '../../components/cars/CarPreview';

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewCar, setPreviewCar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
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
      const carsData = result.data || [];
      
      // Filter cars with availability > 0
      const availableCars = carsData.filter(car => (car.available_quantity || 1) > 0);
      setCars(availableCars);
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

  const handlePreview = async (car) => {
    setShowPreview(true);
    setPreviewLoading(true);
    
    setTimeout(() => {
      setPreviewCar(car);
      setPreviewLoading(false);
    }, 400);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setTimeout(() => {
      setPreviewCar(null);
    }, 300);
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
      <div className="container" style={{
        transform: showContent ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.6s ease-in-out'
      }}>
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
                <CarCard car={car} onBookNow={handleBookNow} onPreview={handlePreview} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Sliding Preview */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: showPreview ? 0 : '-100%',
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 999,
        transition: 'right 0.6s ease-in-out',
        overflow: 'auto'
      }}>
        {previewLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: 'white'
          }}>
            <div className="text-center">
              <div className="spinner-border text-light mb-3" role="status"></div>
              <h4>Loading car preview...</h4>
            </div>
          </div>
        ) : previewCar && (
          <CarPreview car={previewCar} onClose={handleClosePreview} mode="customer" />
        )}
      </div>
    </div>
  );
};



export default AvailableCars;