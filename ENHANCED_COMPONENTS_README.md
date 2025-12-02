# Enhanced Table Components

This document describes the reusable search, sort, filter, and pagination components created for the Car Rental System.

## Components Overview

### 1. Core Reusable Components

#### `SearchBar.js`
- Debounced search input with clear functionality
- Customizable placeholder and styling
- Auto-triggers search after specified delay

#### `SortDropdown.js`
- Dropdown for sorting options
- Supports multiple sort fields and directions
- Customizable options array

#### `FilterPanel.js`
- Multi-type filter support (select, checkbox, range, date, text)
- Collapsible panel with clear all functionality
- Dynamic filter rendering based on configuration

#### `Pagination.js`
- Smart pagination with ellipsis for large page counts
- Items per page selection
- Shows current range and total items

### 2. Custom Hook

#### `useTableData.js`
- Manages all table state (data, loading, error, pagination, filters, sorting)
- Handles API calls with proper parameter building
- Provides refresh functionality
- Automatically resets pagination when filters change

### 3. Enhanced Components

#### `EnhancedDataTable.js`
- Combines all reusable components into one
- Supports both table and custom rendering
- Configurable toolbar with search, sort, and filters
- Loading states and error handling

#### `EnhancedCarGallery.js`
- Car-specific implementation with card layout
- Pre-configured filters for car attributes
- Custom sort options for cars

#### `EnhancedCarsTable.js`
- Admin/Staff car management table
- CRUD action buttons
- Car-specific columns and filters

#### `EnhancedBookingsTable.js`
- Booking management with status badges
- Date range filtering
- Booking-specific actions

#### `EnhancedUsersTable.js`
- User management with role-based actions
- Avatar display and status management
- User-specific filters and sorting

## Backend Integration

The components work with the existing backend endpoints that support:

```javascript
// Query parameters supported:
{
  page: 1,           // Page number
  limit: 10,         // Items per page
  search: "query",   // Search term
  sortField: "name", // Field to sort by
  sortDirection: "asc", // Sort direction
  // ... filter parameters
}

// Expected response format:
{
  success: true,
  data: {
    cars: [...],     // or bookings, users, etc.
    pagination: {
      total: 100,
      pages: 10,
      page: 1,
      limit: 10
    }
  }
}
```

## Usage Examples

### 1. Simple Car Gallery (Customer View)
```javascript
import EnhancedCarGallery from './components/cars/EnhancedCarGallery';

const CarsPage = () => (
  <EnhancedCarGallery apiEndpoint="/api/cars" />
);
```

### 2. Admin Cars Management
```javascript
import EnhancedCarsTable from './components/EnhancedCarsTable';

const AdminCars = () => (
  <EnhancedCarsTable apiEndpoint="/api/admin/cars" />
);
```

### 3. Custom Implementation
```javascript
import useTableData from './hooks/useTableData';
import EnhancedDataTable from './components/common/EnhancedDataTable';

const CustomTable = () => {
  const {
    data, loading, error, totalItems, totalPages,
    searchTerm, handleSearch, filters, handleFilterChange,
    sortConfig, handleSort, currentPage, itemsPerPage,
    handlePageChange, handleItemsPerPageChange
  } = useTableData(fetchFunction);

  return (
    <EnhancedDataTable
      title="Custom Table"
      data={data}
      columns={columns}
      actions={actions}
      loading={loading}
      error={error}
      // ... other props
    />
  );
};
```

## Configuration Options

### Filter Types
- `select`: Dropdown selection
- `checkbox`: Multiple checkbox options
- `range`: Min/max number inputs
- `date`: Date picker
- `text`: Text input (default)

### Column Configuration
```javascript
const columns = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (value, row) => <strong>{value}</strong>
  }
];
```

### Action Configuration
```javascript
const actions = [
  {
    label: '✏️',
    title: 'Edit',
    className: 'btn-outline-warning',
    onClick: (row) => handleEdit(row),
    disabled: (row) => row.status === 'locked'
  }
];
```

## Features

✅ **Search**: Debounced search with clear functionality  
✅ **Sort**: Multiple sort options with visual indicators  
✅ **Filter**: Multi-type filters with clear all option  
✅ **Pagination**: Smart pagination with items per page  
✅ **Loading States**: Built-in loading and error handling  
✅ **Responsive**: Mobile-friendly design  
✅ **Customizable**: Highly configurable components  
✅ **Reusable**: Works across all entity types  
✅ **Backend Integration**: Compatible with existing APIs  

## File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── SearchBar.js
│   │   ├── SortDropdown.js
│   │   ├── FilterPanel.js
│   │   ├── Pagination.js
│   │   └── EnhancedDataTable.js
│   ├── cars/
│   │   └── EnhancedCarGallery.js
│   ├── EnhancedCarsTable.js
│   ├── EnhancedBookingsTable.js
│   └── EnhancedUsersTable.js
├── hooks/
│   └── useTableData.js
└── TableComponentsUsage.js (examples)
```

## Next Steps

1. Replace existing table implementations with enhanced components
2. Update API endpoints to support new query parameters
3. Add export functionality to tables
4. Implement bulk actions for admin tables
5. Add advanced filters (date ranges, multi-select)
6. Add table column customization
7. Implement saved filter presets