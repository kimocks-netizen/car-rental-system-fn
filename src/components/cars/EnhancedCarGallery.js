import React from 'react';
import useTableData from '../../hooks/useTableData';
import EnhancedDataTable from '../common/EnhancedDataTable';
import CarCard from './CarCard';

const EnhancedCarGallery = ({ apiEndpoint = '/cars/available' }) => {
  // Fetch function for cars
  const fetchCars = async (params) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('q', params.search);
    if (params.type) queryParams.append('type', params.type);
    if (params.fuel_type) queryParams.append('fuel_type', params.fuel_type);
    if (params.transmission) queryParams.append('transmission', params.transmission);
    if (params.min_rate) queryParams.append('min_rate', params.min_rate);
    if (params.max_rate) queryParams.append('max_rate', params.max_rate);
    
    const response = await fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL}${apiEndpoint}?${queryParams}`);
    const result = await response.json();
    
    if (result.success) {
      return {
        data: result.data.cars || result.data,
        total: result.data.pagination?.total || result.data.length,
        totalPages: result.data.pagination?.pages || Math.ceil((result.data.pagination?.total || result.data.length) / params.limit)
      };
    }
    throw new Error(result.message || 'Failed to fetch cars');
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
    clearFilters,
    sortConfig,
    handleSort,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refresh
  } = useTableData(fetchCars, {}, { field: 'daily_rate', direction: 'asc' });

  // Filter configuration
  const filterConfig = [
    {
      key: 'type',
      label: 'Type',
      placeholder: 'All Types',
      options: [
        { value: 'sedan', label: 'Sedan' },
        { value: 'suv', label: 'SUV' },
        { value: 'hatchback', label: 'Hatchback' },
        { value: 'luxury', label: 'Luxury' },
        { value: 'van', label: 'Van' }
      ]
    },
    {
      key: 'fuel_type',
      label: 'Fuel',
      placeholder: 'All Fuels',
      options: [
        { value: 'petrol', label: 'Petrol' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'electric', label: 'Electric' },
        { value: 'hybrid', label: 'Hybrid' }
      ]
    },
    {
      key: 'transmission',
      label: 'Transmission',
      placeholder: 'All',
      options: [
        { value: 'manual', label: 'Manual' },
        { value: 'automatic', label: 'Automatic' }
      ]
    }
  ];

  // Sort options
  const sortOptions = [
    { value: 'daily_rate-asc', label: 'Price: Low to High' },
    { value: 'daily_rate-desc', label: 'Price: High to Low' },
    { value: 'brand-asc', label: 'Brand: A to Z' },
    { value: 'brand-desc', label: 'Brand: Z to A' },
    { value: 'year-desc', label: 'Year: Newest First' },
    { value: 'year-asc', label: 'Year: Oldest First' }
  ];

  // Handle price range filter
  const handlePriceRangeChange = (newFilters) => {
    if (newFilters.price_range) {
      handleFilterChange({
        min_rate: newFilters.price_range.min,
        max_rate: newFilters.price_range.max
      });
    } else {
      handleFilterChange(newFilters);
    }
  };

  // Custom sort handler
  const handleCustomSort = (field, direction) => {
    handleSort(field);
  };

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>Error Loading Cars</h5>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={refresh}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="enhanced-car-gallery">
      <EnhancedDataTable
        title="Available Cars"
        data={cars}
        loading={loading}
        error={error}
        
        // Search
        searchTerm={searchTerm}
        onSearch={handleSearch}
        searchPlaceholder="Search cars by brand, model..."
        
        // Sort
        sortConfig={sortConfig}
        onSort={handleCustomSort}
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
        
        // Custom rendering - use cards instead of table
        columns={[]}
        showToolbar={true}
      />
      
      {/* Custom Car Grid Layout */}
      {!loading && cars && cars.length > 0 && (
        <div className="row">
          {cars.map((car) => (
            <div key={car.id} className="col-lg-4 col-md-6 mb-4">
              <CarCard car={car} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedCarGallery;