import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EnhancedDataTable from '../../components/common/EnhancedDataTable';
import CarPreview from '../../components/cars/CarPreview';
import Badge from '../../components/common/Badge';
import useFrontendTableData from '../../hooks/useFrontendTableData';
import { API_BASE_URL } from '../../utils/api';

const StaffCars = () => {
  const { user } = useAuth();
  const [selectedCar, setSelectedCar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch function for cars
  const fetchCars = async () => {
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
      
      return Array.isArray(carsWithBookings) ? carsWithBookings : [];
    }
    throw new Error('Failed to fetch cars');
  };

  const {
    data: cars,
    loading,
    error,
    totalItems,
    totalPages,
    searchTerm,
    handleSearch,
    filters,
    handleFilterChange,
    sortConfig,
    handleSort,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange
  } = useFrontendTableData(fetchCars, {}, { field: 'brand', direction: 'asc' });

  const handlePreview = (car) => {
    setSelectedCar(car);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedCar(null);
  };

  // Table columns configuration
  const columns = [
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
    { 
      key: 'brand', 
      header: 'Brand',
      sortable: true
    },
    { 
      key: 'model', 
      header: 'Model',
      sortable: true
    },
    { 
      key: 'type', 
      header: 'Type',
      sortable: true,
      render: (type) => <Badge variant={type}>{type}</Badge>
    },
    { 
      key: 'year', 
      header: 'Year',
      sortable: true
    },
    ...(!showPreview ? [{ 
      key: 'daily_rate', 
      header: 'Daily Rate',
      sortable: true,
      render: (rate) => `£${rate}`
    }] : []),
    ...(!showPreview ? [{ 
      key: 'availability_status', 
      header: 'Status',
      render: (status, car) => {
        const isAvailable = (car.available_quantity || 1) > 0;
        return <Badge variant={isAvailable ? 'available' : 'not_available'}>{isAvailable ? 'Available' : 'Not Available'}</Badge>;
      }
    }] : []),
    ...(!showPreview ? [{ 
      key: 'available_quantity', 
      header: 'Available',
      sortable: true,
      render: (available, car) => `${available || 1}/${car.total_quantity || 1}`
    }] : []),
    ...(!showPreview ? [{
      key: 'activeBookings',
      header: 'Booked',
      render: (count) => (
        <span style={{
          backgroundColor: count > 0 ? '#ff8c00' : '#6c757d',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          {count || 0}
        </span>
      )
    }] : [])
  ];

  // Actions configuration
  const actions = [
    {
      label: 'Preview Car',
      icon: 'fas fa-eye',
      onClick: handlePreview
    },
    {
      label: 'Edit Car',
      icon: 'fas fa-edit',
      onClick: (car) => console.log('Edit car:', car)
    }
  ];

  // Get unique car types for filter
  const getCarTypes = () => {
    const types = [...new Set(cars.map(car => car.type).filter(Boolean))];
    return types.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }));
  };

  // Filter configuration
  const filterConfig = [
    {
      key: 'availability_status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: 'available', label: 'Available' },
        { value: 'not_available', label: 'Not Available' }
      ]
    },
    {
      key: 'type',
      label: 'Type',
      placeholder: 'All Types',
      options: getCarTypes()
    }
  ];

  // Sort options
  const sortOptions = [
    { value: 'brand-asc', label: 'Brand: A to Z' },
    { value: 'brand-desc', label: 'Brand: Z to A' },
    { value: 'model-asc', label: 'Model: A to Z' },
    { value: 'model-desc', label: 'Model: Z to A' },
    { value: 'year-desc', label: 'Year: Newest First' },
    { value: 'year-asc', label: 'Year: Oldest First' },
    { value: 'daily_rate-desc', label: 'Price: High to Low' },
    { value: 'daily_rate-asc', label: 'Price: Low to High' },
    { value: 'available_quantity-desc', label: 'Availability: High to Low' },
    { value: 'available_quantity-asc', label: 'Availability: Low to High' }
  ];

  return (
    <div style={{minHeight: '100vh', paddingTop: '120px', backgroundImage: 'url(/photos/hero2.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container">
        <div className="row">
          <div className={`col-lg-${showPreview ? '7' : '12'}`} style={{transition: 'all 0.3s ease'}}>
            <h2 className="text-white mb-4">Car Management</h2>
            
            <EnhancedDataTable
              title="Car Management"
              data={cars}
              columns={columns}
              actions={actions}
              loading={loading}
              error={error}
              
              // Search
              searchTerm={searchTerm}
              onSearch={handleSearch}
              searchPlaceholder="Search by brand, model, type, year..."
              
              // Sort
              sortConfig={sortConfig}
              onSort={handleSort}
              sortOptions={sortOptions}
              
              // Filters
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={handleFilterChange}
              
              // Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
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