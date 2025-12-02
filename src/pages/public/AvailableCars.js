import React, { useState, useEffect } from 'react';
import CarCard from '../../components/cars/CarCard';
import CarPreview from '../../components/cars/CarPreview';
import LoadingSpinner from '../../components/common/LoadingSpinner';
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
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedCarForCalendar, setSelectedCarForCalendar] = useState(null);

  useEffect(() => {
    setShowContent(true);
    fetchAvailableCars();
  }, []);

  useEffect(() => {
    if (cars.length > 0) {
      applyFilters();
    }
  }, [itemsToShow, filterType, filterFuelType, filterTransmission, showUnavailable, cars]);

  const applyFilters = (carsToFilter = cars) => {
    let filtered = [...carsToFilter];

    // Apply availability filter
    if (!showUnavailable) {
      filtered = filtered.filter(car => (car.available_quantity || 1) > 0);
    }

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
      const response = await fetch(`${API_BASE_URL}/cars`);

      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }

      const result = await response.json();
      const carsData = result.data?.cars || result.data || [];

      // Set all cars (don't filter by availability here)
      setCars(carsData);
      applyFilters(carsData);
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

  const handleShowCalendar = (car) => {
    setSelectedCarForCalendar(car);
    setShowCalendar(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
    setTimeout(() => {
      setSelectedCarForCalendar(null);
    }, 300);
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
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner />
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
              <div className="flex-grow-1">
                <h1 className="text-white mb-2">Available Cars for Rent</h1>
                <p className="text-light">Choose from our premium fleet of vehicles</p>
              </div>
              <div className="d-flex align-items-center flex-wrap" style={{ gap: '8px' }}>
                <div className="d-flex align-items-center gap-2">
                  {/* <label style={{ color: 'white', marginBottom: 0, fontSize: '14px' }}>Category:</label> */}
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
                  {/* <label style={{ color: 'white', marginBottom: 0, fontSize: '14px' }}>Eng: </label> */}
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
                  {/* <label style={{ color: 'white', marginBottom: 0, fontSize: '14px' }}>Gearbox:</label> */}
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
                    <option value="all" style={{ backgroundColor: '#333', color: 'white' }}>Transimission</option>
                    <option value="automatic" style={{ backgroundColor: '#333', color: 'white' }}>Automatic</option>
                    <option value="manual" style={{ backgroundColor: '#333', color: 'white' }}>Manual</option>
                  </select>

                </div>
                <div className="d-flex align-items-center gap-2">
                  {/* <label style={{ color: 'white', marginBottom: 0, fontSize: '14px' }}>Items:</label> */}
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
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid #555',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    minWidth: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowUnavailable(!showUnavailable)}
                  >
                    <input
                      type="checkbox"
                      checked={showUnavailable}
                      onChange={(e) => setShowUnavailable(e.target.checked)}
                      style={{ marginRight: '8px', accentColor: '#dc3545' }}
                    />
                    Show Unavailable
                  </div>
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
                <CarCard car={car} onBookNow={handleBookNow} onPreview={handlePreview} onShowCalendar={handleShowCalendar} />
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
            height: '100vh'
          }}>
            <LoadingSpinner />
          </div>
        ) : previewCar && (
          <CarPreview car={previewCar} onClose={handleClosePreview} mode="customer" />
        )}
      </div>

      {/* Calendar Modal */}
      {showCalendar && selectedCarForCalendar && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto', overflow: 'auto'}}>
          <div className="modal-dialog modal-lg" style={{marginTop: '50px', marginBottom: '50px', pointerEvents: 'auto'}}>
            <div style={{
              backgroundColor: 'black',
              border: '2px solid red',
              borderRadius: '15px',
              padding: '25px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(255, 0, 0, 0.1)',
              position: 'relative',
              pointerEvents: 'auto'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid rgba(255, 0, 0, 0.3)'
              }}>
                <h5 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                  {selectedCarForCalendar.brand} {selectedCarForCalendar.model} - Availability
                </h5>
                <button 
                  onClick={handleCloseCalendar}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-car" style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '15px' }}></i>
                  <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>Car Currently Unavailable</h4>
                  <p style={{ color: 'white', marginBottom: '15px' }}>
                    This {selectedCarForCalendar.brand} {selectedCarForCalendar.model} is currently rented out.
                  </p>
                  <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                    The car will be available again when the current rental period ends.
                    Please check back later or choose another vehicle from our fleet.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <button
                    onClick={handleCloseCalendar}
                    style={{
                      backgroundColor: '#6c757d',
                      border: 'none',
                      color: 'white',
                      padding: '12px 25px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleCloseCalendar();
                      // Scroll to available cars
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      backgroundColor: '#dc3545',
                      border: 'none',
                      color: 'white',
                      padding: '12px 25px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                    Browse Available Cars
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default AvailableCars;