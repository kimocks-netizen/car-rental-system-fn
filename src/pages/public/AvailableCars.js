import React, { useState, useEffect } from 'react';
import CarCard from '../../components/cars/CarCard';
import CarPreview from '../../components/cars/CarPreview';
import { API_BASE_URL } from '../../utils/api';

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewCar, setPreviewCar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(6);

  const [filterType, setFilterType] = useState('all');
  const [filterFuelType, setFilterFuelType] = useState('all');
  const [filterTransmission, setFilterTransmission] = useState('all');

  useEffect(() => {
    setShowContent(true);
    fetchAvailableCars();
  }, []);

  useEffect(() => {
    if (cars.length > 0) {
      applyFilters();
    }
  }, [itemsToShow, filterType, filterFuelType, filterTransmission, cars]);

  const applyFilters = (carsToFilter = cars) => {
    let filtered = [...carsToFilter];
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(car => car.type?.toLowerCase() === filterType.toLowerCase());
    }
    
    // Apply fuel type filter
    if (filterFuelType !== 'all') {
      filtered = filtered.filter(car => car.fuel_type?.toLowerCase() === filterFuelType.toLowerCase());
    }
    
    // Apply transmission filter
    if (filterTransmission !== 'all') {
      filtered = filtered.filter(car => car.transmission?.toLowerCase() === filterTransmission.toLowerCase());
    }
    

    
    // Apply items limit
    const finalFiltered = itemsToShow === 'all' ? filtered : filtered.slice(0, itemsToShow);
    setFilteredCars(finalFiltered);
  };

  const fetchAvailableCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cars/available`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      
      const result = await response.json();
      const carsData = result.data?.cars || result.data || [];
      
      // Filter cars with availability > 0
      const availableCars = carsData.filter(car => (car.available_quantity || 1) > 0);
      setCars(availableCars);
      applyFilters(availableCars);
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
      paddingBottom: '50px',
      backgroundImage: 'url(/photos/hero2.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll'
    }}>
      <div className="container" style={{
        transform: showContent ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.6s ease-in-out'
      }}>
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="text-center flex-grow-1">
                <h1 className="text-white mb-2">Available Cars for Rent</h1>
                <p className="text-light">Choose from our premium fleet of vehicles</p>
              </div>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <label style={{ color: 'white', marginBottom: 0, fontSize: '14px' }}>Items:</label>
                  <select 
                    value={itemsToShow}
                    onChange={(e) => {
                      const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
                      setItemsToShow(value);
                      applyFilters();
                    }}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid #555',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      fontSize: '14px',
                      minWidth: '80px'
                    }}
                  >
                    <option value={3} style={{ backgroundColor: '#333', color: 'white' }}>3</option>
                    <option value={6} style={{ backgroundColor: '#333', color: 'white' }}>6</option>
                    <option value={12} style={{ backgroundColor: '#333', color: 'white' }}>12</option>
                    <option value={18} style={{ backgroundColor: '#333', color: 'white' }}>18</option>
                    <option value="all" style={{ backgroundColor: '#333', color: 'white' }}>All</option>
                  </select>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <label style={{ color: 'white', marginBottom: 0, fontSize: '14px' }}>Category:</label>
                  <select 
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      applyFilters();
                    }}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid #555',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      fontSize: '14px',
                      minWidth: '100px'
                    }}
                  >
                    <option value="all" style={{ backgroundColor: '#333', color: 'white' }}>All Types</option>
                    <option value="sedan" style={{ backgroundColor: '#333', color: 'white' }}>Sedan</option>
                    <option value="suv" style={{ backgroundColor: '#333', color: 'white' }}>SUV</option>
                    <option value="hatchback" style={{ backgroundColor: '#333', color: 'white' }}>Hatchback</option>
                    <option value="coupe" style={{ backgroundColor: '#333', color: 'white' }}>Coupe</option>
                    <option value="luxury" style={{ backgroundColor: '#333', color: 'white' }}>Luxury</option>
                    <option value="van" style={{ backgroundColor: '#333', color: 'white' }}>Van</option>
                  </select>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <label style={{ color: 'white', marginBottom: 0, fontSize: '14px' }}>Engine:</label>
                  <select 
                    value={filterFuelType}
                    onChange={(e) => {
                      setFilterFuelType(e.target.value);
                      applyFilters();
                    }}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid #555',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      fontSize: '14px',
                      minWidth: '100px'
                    }}
                  >
                    <option value="all" style={{ backgroundColor: '#333', color: 'white' }}>All Fuels</option>
                    <option value="petrol" style={{ backgroundColor: '#333', color: 'white' }}>Petrol</option>
                    <option value="diesel" style={{ backgroundColor: '#333', color: 'white' }}>Diesel</option>
                    <option value="electric" style={{ backgroundColor: '#333', color: 'white' }}>Electric</option>
                    <option value="hybrid" style={{ backgroundColor: '#333', color: 'white' }}>Hybrid</option>
                  </select>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <label style={{ color: 'white', marginBottom: 0, fontSize: '14px' }}>Gearbox:</label>
                  <select 
                    value={filterTransmission}
                    onChange={(e) => {
                      setFilterTransmission(e.target.value);
                      applyFilters();
                    }}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid #555',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      fontSize: '14px',
                      minWidth: '100px'
                    }}
                  >
                    <option value="all" style={{ backgroundColor: '#333', color: 'white' }}>All</option>
                    <option value="automatic" style={{ backgroundColor: '#333', color: 'white' }}>Automatic</option>
                    <option value="manual" style={{ backgroundColor: '#333', color: 'white' }}>Manual</option>
                  </select>
                </div>
                

              </div>
            </div>
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center text-white">
            <h4>No cars available at the moment</h4>
            <p>Please check back later or contact us for assistance.</p>
          </div>
        ) : (
          <div className="row">
            {filteredCars.map(car => (
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