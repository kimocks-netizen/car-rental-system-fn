import React, { useState } from 'react';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  title = "Filters",
  isCollapsible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (filterKey, value) => {
    onFilterChange({ [filterKey]: value });
  };

  const renderFilterInput = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            className="form-select"
            value={filter.value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            <option value="" style={{ backgroundColor: '#333' }}>
              {filter.placeholder || 'All'}
            </option>
            {filter.options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                style={{ backgroundColor: '#333', color: 'white' }}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div>
            {filter.options.map((option) => (
              <div key={option.value} className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`${filter.key}-${option.value}`}
                  checked={Array.isArray(filter.value) ? filter.value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(filter.value) ? filter.value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleFilterChange(filter.key, newValues);
                  }}
                />
                <label className="form-check-label text-white" htmlFor={`${filter.key}-${option.value}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'range':
        return (
          <div>
            <div className="row">
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={filter.value?.min || ''}
                  onChange={(e) => handleFilterChange(filter.key, { 
                    ...filter.value, 
                    min: e.target.value 
                  })}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={filter.value?.max || ''}
                  onChange={(e) => handleFilterChange(filter.key, { 
                    ...filter.value, 
                    max: e.target.value 
                  })}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className="form-control"
            value={filter.value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          />
        );

      default:
        return (
          <input
            type="text"
            className="form-control"
            placeholder={filter.placeholder}
            value={filter.value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          />
        );
    }
  };

  return (
    <div className="card" style={{
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '10px'
    }}>
      <div className="card-header" style={{
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        border: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 text-white">{title}</h6>
          <div>
            {onClearFilters && (
              <button
                className="btn btn-sm btn-outline-light me-2"
                onClick={onClearFilters}
                style={{ fontSize: '0.8rem' }}
              >
                Clear All
              </button>
            )}
            {isCollapsible && (
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="card-body">
          {filters.map((filter) => (
            <div key={filter.key} className="mb-3">
              <label className="form-label text-white">{filter.label}</label>
              {renderFilterInput(filter)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;