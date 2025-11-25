import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CarsTable from '../../components/cars/CarsTable';
import CarPreview from '../../components/cars/CarPreview';
import { API_BASE_URL } from '../../utils/api';

const StaffCars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const [carsResponse, bookingsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/cars`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_BASE_URL}/bookings`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (carsResponse.ok && bookingsResponse.ok) {
        const carsResult = await carsResponse.json();
        const bookingsResult = await bookingsResponse.json();
        
        const carsData = carsResult.data?.cars || carsResult.cars || carsResult;
        const bookingsData = bookingsResult.data?.bookings || bookingsResult.bookings || bookingsResult;
        
        // Add booking info to cars and calculate availability
        const carsWithBookings = carsData.map(car => {
          const carBookings = bookingsData.filter(booking => 
            booking.car_id === car.id && 
            (booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'active')
          );
          const totalQuantity = car.total_quantity || 1;
          const bookedCount = carBookings.length;
          const availableQuantity = Math.max(0, totalQuantity - bookedCount);
          
          return { 
            ...car, 
            activeBookings: bookedCount,
            available_quantity: availableQuantity,
            total_quantity: totalQuantity
          };
        });
        
        setCars(Array.isArray(carsWithBookings) ? carsWithBookings : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } else {
        setError('Failed to fetch data');
        setCars([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error loading data');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (car) => {
    setSelectedCar(car);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedCar(null);
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="text-center text-white">
            <h3>Loading cars...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="container">
          <div className="alert alert-danger">
            <h5>Error loading cars</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchCars}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className={`col-lg-${showPreview ? '7' : '12'}`} style={{transition: 'all 0.3s ease'}}>
            <h2 className="text-white mb-4">Car Management</h2>
            <CarsTable 
              cars={cars}
              onPreview={handlePreview}
              onEdit={(car) => console.log('Edit car:', car)}
              userRole="staff"
              showBookings={true}
              isPreviewOpen={showPreview}
            />
          </div>

          {showPreview && (
            <div className="col-lg-5" style={{transform: showPreview ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease'}}>
              <CarPreview 
                car={selectedCar}
                onClose={handleClosePreview}
                mode="staff"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffCars;