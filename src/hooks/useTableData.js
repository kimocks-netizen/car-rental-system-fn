import { useState, useEffect, useMemo } from 'react';

const useTableData = (
  fetchData, 
  initialFilters = {}, 
  initialSort = { field: '', direction: 'asc' },
  initialPage = 1,
  initialItemsPerPage = 10
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch data function
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction,
        ...filters
      };

      const result = await fetchData(params);
      
      if (result.data) {
        setData(result.data);
        setTotalItems(result.total || result.data.length);
        setTotalPages(result.totalPages || Math.ceil((result.total || result.data.length) / itemsPerPage));
      } else {
        setData(result);
        setTotalItems(result.length);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
      }
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data when dependencies change
  useEffect(() => {
    loadData();
  }, [currentPage, itemsPerPage, searchTerm, filters, sortConfig]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filtering
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
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Refresh data
  const refresh = () => {
    loadData();
  };

  return {
    // Data state
    data,
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
    setData // For manual data updates
  };
};

export default useTableData;