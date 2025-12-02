import React from 'react';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import SimpleFilter from './SimpleFilter';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import ActionsDropdown from './ActionsDropdown';

const EnhancedDataTable = ({
  title,
  data,
  columns,
  actions,
  loading = false,
  error = null,
  
  // Search props
  searchTerm,
  onSearch,
  searchPlaceholder = "Search...",
  showSearch = true,
  
  // Sort props
  sortConfig,
  onSort,
  sortOptions = [],
  showSort = true,
  
  // Filter props
  filters = [],
  filterValues,
  onFilterChange,
  showFilters = true,
  
  // Pagination props
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showPagination = true,
  
  // Layout props
  showToolbar = true,
  className = ""
}) => {
  
  if (error) {
    return (
      <div className={`alert alert-danger ${className}`}>
        <h5>Error</h5>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`enhanced-data-table ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="mb-3">
          <div className="d-flex gap-3 align-items-end flex-wrap">
            {showSearch && (
              <div className="flex-grow-1" style={{ minWidth: '250px' }}>
                <SearchBar
                  placeholder={searchPlaceholder}
                  onSearch={onSearch}
                  loading={loading}
                />
              </div>
            )}
            
            {showSort && sortOptions.length > 0 && (
              <div style={{ minWidth: '200px' }}>
                <SortDropdown
                  options={sortOptions}
                  value={`${sortConfig.field}-${sortConfig.direction}`}
                  onChange={(value) => {
                    const [field, direction] = value.split('-');
                    onSort(field, direction);
                  }}
                />
              </div>
            )}
            
            {showFilters && filters.length > 0 && filters.map((filter) => (
              <div key={filter.key} style={{ minWidth: '150px' }}>
                <SimpleFilter
                  label={filter.label}
                  value={filterValues[filter.key]}
                  options={filter.options}
                  placeholder={filter.placeholder}
                  onChange={(value) => onFilterChange({ [filter.key]: value })}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div style={{
        backgroundColor: 'black',
        border: '2px solid red',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '20px',
        color: 'white',
        boxShadow: '0 4px 15px rgba(255, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid rgba(255, 0, 0, 0.3)'
        }}>
          <h5 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
            {title}
          </h5>
          <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
            {totalItems || (Array.isArray(data) ? data.length : 0)} records
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <LoadingSpinner />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ color: 'white', margin: 0 }}>No data available</p>
          </div>
        ) : (
          <div style={{
            borderRadius: '12px',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderBottom: '2px solid rgba(255, 0, 0, 0.3)'
                }}>
                  {columns.map((col, index) => (
                    <th 
                      key={index} 
                      style={{
                        color: 'white',
                        padding: '15px 20px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        cursor: col.sortable ? 'pointer' : 'default'
                      }}
                      onClick={() => col.sortable && onSort && onSort(col.key)}
                    >
                      <div className="d-flex align-items-center">
                        {col.header}
                        {col.sortable && sortConfig.field === col.key && (
                          <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-2`}></i>
                        )}
                      </div>
                    </th>
                  ))}
                  {actions && (
                    <th style={{
                      color: 'white',
                      padding: '15px 20px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} style={{
                        color: 'white',
                        padding: '12px 20px',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle',
                        lineHeight: '1.4'
                      }}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    {actions && (
                      <td style={{
                        padding: '12px 20px',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}>
                        <ActionsDropdown actions={actions} row={row} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {showPagination && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDataTable;