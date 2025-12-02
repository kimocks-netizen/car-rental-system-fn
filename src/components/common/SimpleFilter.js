import React from 'react';

const SimpleFilter = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = "All",
  className = "" 
}) => {
  return (
    <div className={`simple-filter ${className}`}>
      <label className="form-label text-white mb-2">{label}</label>
      <select
        className="form-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          borderRadius: '8px'
        }}
        onFocus={(e) => e.target.style.borderColor = 'red'}
        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
      >
        <option value="" style={{ backgroundColor: '#333' }}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            style={{ backgroundColor: '#333', color: 'white' }}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SimpleFilter;