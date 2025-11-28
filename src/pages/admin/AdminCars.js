import React, { useState } from 'react';
import { uploadCarImage } from '../../services/supabase';
import CarPreview from '../../components/cars/CarPreview';
import EnhancedCarsTable from '../../components/EnhancedCarsTable';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { API_BASE_URL } from '../../utils/api';

const AdminCars = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewCar, setPreviewCar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteCar = (car) => {
    setSelectedCar(car);
    setShowDeleteModal(true);
  };

  const confirmDeleteCar = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/cars/${selectedCar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete car');
      }
      
      setShowDeleteModal(false);
      window.location.reload(); // Refresh to show updated list
    } catch (err) {
      console.error('Delete car error:', err);
      alert('Error: ' + err.message);
    } finally {
      setDeleting(false);
      setSelectedCar(null);
    }
  };

  const handleAddCar = async (formData) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      
      const { imageFile, ...carData } = formData;
      
      let imageUrl = null;
      if (imageFile) {
        const tempId = Date.now().toString();
        imageUrl = await uploadCarImage(imageFile, tempId);
      }
      
      const finalCarData = { ...carData, image_url: imageUrl };
      
      const carResponse = await fetch(`${API_BASE_URL}/cars`, {
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
      
      setShowAddModal(false);
      window.location.reload(); // Refresh to show new car
    } catch (err) {
      console.error('Add car error:', err);
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };





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
            
            <EnhancedCarsTable 
              apiEndpoint="/cars"
              onPreview={handlePreviewCar}
              onDelete={handleDeleteCar}
            />
          </div>
        </div>
      </div>
      
      {showAddModal && <AddCarModal onClose={() => setShowAddModal(false)} onSubmit={handleAddCar} uploading={uploading} />}
      
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteCar}
        title="Delete Car"
        message={selectedCar ? `Are you sure you want to delete the ${selectedCar.brand} ${selectedCar.model}? This action cannot be undone.` : ''}
        confirmText="Delete Car"
        cancelText="Cancel"
        loading={deleting}
        type="danger"
      />
      
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
          <CarPreview car={previewCar} onClose={handleClosePreview} isAdmin={true} />
        )}
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
    total_quantity: '1',
    customQuantity: '',
    imageFile: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean data - ensure required fields are present
    const quantity = formData.total_quantity === 'custom' ? parseInt(formData.customQuantity) : parseInt(formData.total_quantity);
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
      total_quantity: quantity,
      available_quantity: quantity,
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
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={formData.total_quantity}
                onChange={(e) => setFormData({...formData, total_quantity: e.target.value, customQuantity: ''})}
                required
              >
                <option value="1">1 Car</option>
                <option value="2">2 Cars</option>
                <option value="3">3 Cars</option>
                <option value="4">4 Cars</option>
                <option value="5">5 Cars</option>
                <option value="custom">Custom Amount</option>
              </select>
            </div>
            {formData.total_quantity === 'custom' && (
              <div className="col-md-6 mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter quantity"
                  min="1"
                  max="50"
                  value={formData.customQuantity}
                  onChange={(e) => setFormData({...formData, customQuantity: e.target.value})}
                  required
                />
              </div>
            )}
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



export default AdminCars;