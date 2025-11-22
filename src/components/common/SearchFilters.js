import React, { useState } from 'react';

const SearchFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    brand: '',
    type: '',
    priceRange: [0, 1000],
    transmission: '',
    fuelType: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Search Filters</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <select 
            className="form-select" 
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <option value="">All Brands</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="bmw">BMW</option>
            <option value="mercedes">Mercedes</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Car Type</label>
          <div>
            {['sedan', 'suv', 'hatchback', 'luxury', 'van'].map(type => (
              <div key={type} className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id={type}
                  checked={filters.type === type}
                  onChange={(e) => handleFilterChange('type', e.target.checked ? type : '')}
                />
                <label className="form-check-label" htmlFor={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Transmission</label>
          <select 
            className="form-select"
            value={filters.transmission}
            onChange={(e) => handleFilterChange('transmission', e.target.value)}
          >
            <option value="">Any</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Fuel Type</label>
          <select 
            className="form-select"
            value={filters.fuelType}
            onChange={(e) => handleFilterChange('fuelType', e.target.value)}
          >
            <option value="">Any</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;