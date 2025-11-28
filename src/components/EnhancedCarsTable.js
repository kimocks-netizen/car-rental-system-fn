import React from 'react';
import useFrontendTableData from '../hooks/useFrontendTableData';
import EnhancedDataTable from './common/EnhancedDataTable';
import Badge from './common/Badge';

const EnhancedCarsTable = ({ apiEndpoint = '/admin/cars', onPreview, onDelete }) => {
  // Fetch function for cars (fetch all data once)
  const fetchCars = async () => {
    const response = await fetch(`${process.env.REACT_APP_CAR_RENTAL_API_URL}${apiEndpoint}?limit=1000`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data.cars || result.data;
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
  } = useFrontendTableData(fetchCars, {}, { field: 'created_at', direction: 'desc' });

  // Table columns configuration
  const columns = [
    {
      key: 'image_url',
      header: 'Image',
      render: (value) => (
        <img 
          src={value || '/photos/car1.jpg'} 
          alt="Car" 
          style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
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
      render: (value) => <Badge variant={value}>{value}</Badge>
    },
    {
      key: 'year',
      header: 'Year',
      sortable: true
    },
    {
      key: 'daily_rate',
      header: 'Daily Rate',
      sortable: true,
      render: (value) => `$${value}`
    },
    {
      key: 'fuel_type',
      header: 'Fuel Type',
      render: (value) => <Badge variant={value}>{value}</Badge>
    },
    {
      key: 'transmission',
      header: 'Transmission',
      render: (value) => <Badge variant={value}>{value}</Badge>
    },
    {
      key: 'availability_status',
      header: 'Status',
      sortable: true,
      render: (value) => <Badge variant={value}>{value}</Badge>
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Actions configuration
  const actions = [
    {
      label: 'Preview',
      icon: 'fas fa-eye',
      onClick: (car) => {
        if (onPreview) {
          onPreview(car);
        }
      }
    },
    {
      label: 'Edit Car',
      icon: 'fas fa-edit',
      onClick: (car) => {
        console.log('Edit car:', car);
      }
    },
    {
      label: 'Delete Car',
      icon: 'fas fa-trash',
      onClick: (car) => {
        if (onDelete) {
          onDelete(car);
        }
      },
      disabled: (car) => car.availability_status === 'rented'
    }
  ];

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
      key: 'availability_status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: 'available', label: 'Available' },
        { value: 'rented', label: 'Rented' },
        { value: 'maintenance', label: 'Maintenance' }
      ]
    }
  ];

  // Sort options
  const sortOptions = [
    { value: 'created_at-desc', label: 'Newest First' },
    { value: 'created_at-asc', label: 'Oldest First' },
    { value: 'brand-asc', label: 'Brand: A to Z' },
    { value: 'brand-desc', label: 'Brand: Z to A' },
    { value: 'daily_rate-asc', label: 'Price: Low to High' },
    { value: 'daily_rate-desc', label: 'Price: High to Low' },
    { value: 'year-desc', label: 'Year: Newest First' },
    { value: 'year-asc', label: 'Year: Oldest First' }
  ];

  return (
    <EnhancedDataTable
      title="Cars Management"
      data={cars}
      columns={columns}
      actions={actions}
      loading={loading}
      error={error}
      
      // Search
      searchTerm={searchTerm}
      onSearch={handleSearch}
      searchPlaceholder="Search cars by brand, model..."
      
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
  );
};

export default EnhancedCarsTable;