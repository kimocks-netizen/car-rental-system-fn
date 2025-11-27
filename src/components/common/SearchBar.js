import React, { useState, useEffect } from 'react';

const SearchBar = ({ 
  placeholder = "Type here to start searching...", 
  onSearch, 
  debounceMs = 300,
  className = "",
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, debounceMs]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`search-bar-container ${className}`} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <i 
          className="fas fa-search" 
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255, 255, 255, 0.4)',
            zIndex: 1
          }}
        ></i>
        {loading ? (
          <div 
            className="spinner-border spinner-border-sm" 
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.6)',
              width: '16px',
              height: '16px',
              zIndex: 1
            }}
          ></div>
        ) : searchTerm && (
          <i 
            className="fas fa-times" 
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              zIndex: 1
            }}
          ></i>
        )}
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '8px',
            paddingLeft: '40px',
            paddingRight: (loading || searchTerm) ? '40px' : '12px'
          }}
          onFocus={(e) => e.target.style.borderColor = 'red'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
        />
      </div>
    </div>
  );
};

export default SearchBar;