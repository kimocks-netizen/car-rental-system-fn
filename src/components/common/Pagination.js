import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [5, 10, 25, 50, 'All'],
  className = ""
}) => {
  const getVisiblePages = () => {
    if (totalPages <= 1) return [1];
    
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return [...new Set(rangeWithDots)];
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Always show pagination info, but hide navigation if only 1 page

  return (
    <div className={`d-flex justify-content-between align-items-center ${className}`}>
      <div className="d-flex align-items-center">
        <span className="text-white me-3">
          Showing {startItem} to {endItem} of {totalItems} entries  :&nbsp;
        </span>
        
        {showItemsPerPage && (
          <div className="d-flex align-items-center ms-4">
            <label className="text-white me-3" style={{ lineHeight: '1.5', alignSelf: 'center', marginBottom: '0' }}> Show:</label>
            <select
              className="form-select form-select-sm"
              value={itemsPerPage}
              onChange={(e) => {
                const value = e.target.value;
                onItemsPerPageChange(value === 'All' ? totalItems : parseInt(value));
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: 'auto'
              }}
            >
              {itemsPerPageOptions.map(option => (
                <option 
                  key={option} 
                  value={option}
                  style={{ backgroundColor: '#333', color: 'white' }}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>


    </div>
  );
};

export default Pagination;