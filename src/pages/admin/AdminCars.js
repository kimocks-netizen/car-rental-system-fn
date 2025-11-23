import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { uploadCarImage } from '../../services/supabase';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewCar, setPreviewCar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/cars', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      
      const result = await response.json();
      setCars(result.data.cars || result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewCar = async (car) => {
    setShowPreview(true);
    setPreviewLoading(true);
    
    // Slower transition with reduced loading time
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

  const handleAddCar = async (formData) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      
      // Extract image file and car data
      const { imageFile, ...carData } = formData;
      
      // Upload image to Supabase first if provided
      let imageUrl = null;
      if (imageFile) {
        try {
          // Generate a temporary ID for the upload
          const tempId = Date.now().toString();
          imageUrl = await uploadCarImage(imageFile, tempId);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error('Failed to upload image: ' + uploadError.message);
        }
      }
      
      // Add image URL to car data
      const finalCarData = {
        ...carData,
        image_url: imageUrl
      };
      
      console.log('Creating car with data:', finalCarData);
      
      const carResponse = await fetch('http://localhost:8000/api/cars', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalCarData)
      });
      
      if (!carResponse.ok) {
        const errorData = await carResponse.json();
        throw new Error(errorData.message || 'Failed to create car');
      }
      
      const result = await carResponse.json();
      console.log('Car created successfully:', result);
      
      setShowAddModal(false);
      fetchCars();
    } catch (err) {
      console.error('Add car error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const carColumns = [
    { 
      key: 'image_url', 
      header: 'Image',
      render: (imageUrl) => (
        <img 
          src={imageUrl || '/photos/car1.jpg'} 
          alt="Car" 
          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )
    },
    { key: 'brand', header: 'Brand' },
    { key: 'model', header: 'Model' },
    { key: 'type', header: 'Type' },
    { key: 'year', header: 'Year' },
    { 
      key: 'daily_rate', 
      header: 'Daily Rate',
      render: (rate) => `£${rate}`
    },
    { 
      key: 'availability_status', 
      header: 'Status',
      render: (status) => (
        <span style={{
          backgroundColor: status === 'available' ? '#28a745' : '#dc3545',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '500',
          textTransform: 'capitalize'
        }}>
          {status}
        </span>
      )
    }
  ];

  const carActions = [
    {
      label: <i className="fas fa-eye" style={{color: '#17a2b8'}}></i>,
      className: 'btn-link',
      onClick: (car) => {
        handlePreviewCar(car);
      },
      title: 'Preview Car'
    },
    {
      label: <i className="fas fa-edit" style={{color: 'white'}}></i>,
      className: 'btn-link',
      onClick: (car) => {
        console.log('Edit car:', car);
      },
      title: 'Edit Car'
    },
    {
      label: <i className="fas fa-trash" style={{color: '#dc3545'}}></i>,
      className: 'btn-link',
      onClick: (car) => {
        console.log('Delete car:', car);
      },
      title: 'Delete Car'
    }
  ];

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
          <div className="col-12">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="text-white">Car Management</h2>
              <button 
                className="btn btn-success"
                onClick={() => setShowAddModal(true)}
                style={{ padding: '8px 16px', height: '46px' }}
              >
                <i className="fas fa-plus me-2"></i>Add Car
              </button>
            </div>
            
            <DataTable 
              title={`All Cars (${cars.length})`}
              data={cars}
              columns={carColumns}
              actions={carActions}
            />
          </div>
        </div>
      </div>
      
      {showAddModal && <AddCarModal onClose={() => setShowAddModal(false)} onSubmit={handleAddCar} uploading={uploading} />}
      
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
          <CarPreviewSlide car={previewCar} onClose={handleClosePreview} />
        )}
      </div>
      
      {/* Overlay to slide table left */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: showPreview ? '-100%' : 0,
        width: '100%',
        height: '100vh',
        transition: 'left 0.6s ease-in-out',
        zIndex: showPreview ? -1 : 'auto'
      }}>
        {/* This creates the sliding effect for the main content */}
      </div>
    </div>
  );
};

const AddCarModal = ({ onClose, onSubmit, uploading }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    type: '',
    year: '',
    daily_rate: '',
    fuel_type: '',
    transmission: '',
    capacity: '4',
    mileage: '',
    description: '',
    imageFile: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean data - ensure required fields are present
    const cleanData = {
      brand: formData.brand,
      model: formData.model,
      type: formData.type,
      year: parseInt(formData.year),
      daily_rate: parseFloat(formData.daily_rate),
      capacity: parseInt(formData.capacity),
      fuel_type: formData.fuel_type || 'petrol',
      transmission: formData.transmission || 'manual',
      description: formData.description || '',
      imageFile: formData.imageFile
    };
    
    // Add optional fields if they have values
    if (formData.mileage) {
      cleanData.mileage = parseInt(formData.mileage);
    }
    
    onSubmit(cleanData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'black',
        border: '2px solid red',
        borderRadius: '15px',
        padding: '30px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h4 style={{ color: 'white', marginBottom: '20px' }}>Add New Car</h4>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Model"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="coupe">Coupe</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                required
              >
                <option value="">Select Year</option>
                {Array.from({length: new Date().getFullYear() - 1999}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={formData.daily_rate}
                onChange={(e) => setFormData({...formData, daily_rate: e.target.value})}
                required
              >
                <option value="">Select Daily Rate</option>
                <option value="30">£30</option>
                <option value="40">£40</option>
                <option value="50">£50</option>
                <option value="70">£70</option>
                <option value="100">£100</option>
                <option value="150">£150</option>
                <option value="200">£200</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                required
              >
                <option value="2">2 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="7">7 Seats</option>
                <option value="8">8 Seats</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={formData.fuel_type}
                onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
              >
                <option value="">Select Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={formData.transmission}
                onChange={(e) => setFormData({...formData, transmission: e.target.value})}
              >
                <option value="">Select Transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
            <div className="col-12 mb-3">
              <textarea
                className="form-control"
                placeholder="Description"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="col-12 mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setFormData({...formData, imageFile: e.target.files[0]})}
              />
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={uploading}>
              {uploading ? 'Adding...' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CarPreviewSlide = ({ car, onClose }) => {
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
            Admin Preview - How customers see this car
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
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminCars;