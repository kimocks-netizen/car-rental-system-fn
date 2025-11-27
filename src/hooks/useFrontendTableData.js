import { useState, useEffect, useMemo } from 'react';

const useFrontendTableData = (
  fetchData, 
  initialFilters = {}, 
  initialSort = { field: '', direction: 'asc' },
  initialPage = 1,
  initialItemsPerPage = 5
) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Fetch all data once
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchData();
      console.log('Fetch result:', result);
      
      // Handle nested data structure (e.g., result.data.cars)
      let dataArray = result;
      if (result && result.data) {
        dataArray = result.data.cars || result.data.users || result.data.bookings || result.data;
      }
      
      console.log('Extracted data array:', dataArray);
      console.log('Is array?', Array.isArray(dataArray));
      
      setAllData(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort data on frontend
  const processedData = useMemo(() => {
    if (!Array.isArray(allData)) {
      console.log('allData is not an array:', allData);
      return [];
    }
    let filtered = [...allData];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          filtered = filtered.filter(item => {
            const itemValue = item[key] || item[`user_${key}`];
            return itemValue === value;
          });
        }
      });
    }

    // Apply sorting
    if (sortConfig.field) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [allData, searchTerm, sortConfig, filters]);

  // Paginate processed data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure current page is valid
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    const prevFilters = JSON.stringify(filters);
    const updatedFilters = { ...filters, ...newFilters };
    const newFiltersStr = JSON.stringify(updatedFilters);
    
    setFilters(updatedFilters);
    
    // Only reset page if filters actually changed
    if (prevFilters !== newFiltersStr) {
      setCurrentPage(1);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field, direction) => {
    if (direction) {
      setSortConfig({ field, direction });
    } else {
      setSortConfig(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    }
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Refresh data
  const refresh = () => {
    loadData();
  };

  return {
    // Data state
    data: paginatedData,
    loading,
    error,
    totalItems,
    totalPages,
    
    // Search state
    searchTerm,
    handleSearch,
    
    // Filter state
    filters,
    handleFilterChange,
    clearFilters,
    
    // Sort state
    sortConfig,
    handleSort,
    
    // Pagination state
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    
    // Actions
    refresh,
    setData: setAllData
  };
};

export default useFrontendTableData;