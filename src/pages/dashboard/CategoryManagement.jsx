import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiToggleRight, FiToggleLeft, FiSearch, FiPlus } from 'react-icons/fi';
import { getData, postData, putData } from '../../utils/http';
import { toast } from 'react-hot-toast';

const CategoryManagement = () => {
  // State variables
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    powerCapacity: '',
    voltage: '',
    batteryType: 'Lithium-ion',
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'mm'
    },
    weight: {
      value: '',
      unit: 'g'
    },
    chargingTime: '',
    dischargingTime: '',
    isActive: true,
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Search state
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    minPower: '',
    maxPower: '',
    minVoltage: '',
    maxVoltage: '',
    batteryType: ''
  });

  // Custom debounce function
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Fetch categories with pagination, search and filters
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let queryParams = `page=${pagination.page}&limit=${pagination.limit}`;
      
      if (search) {
        queryParams += `&search=${search}`;
      }
      
      if (filters.minPower) {
        queryParams += `&minPower=${filters.minPower}`;
      }
      
      if (filters.maxPower) {
        queryParams += `&maxPower=${filters.maxPower}`;
      }
      
      if (filters.minVoltage) {
        queryParams += `&minVoltage=${filters.minVoltage}`;
      }
      
      if (filters.maxVoltage) {
        queryParams += `&maxVoltage=${filters.maxVoltage}`;
      }
      
      if (filters.batteryType) {
        queryParams += `&batteryType=${filters.batteryType}`;
      }
      
      const response = await getData(`/categories?${queryParams}`);
      setCategories(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      toast.error(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const { value } = e.target;
    debouncedSearch(value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when applying filters
    fetchCategories();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      minPower: '',
      maxPower: '',
      minVoltage: '',
      maxVoltage: '',
      batteryType: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Load categories on component mount and when dependencies change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Modal functions
  const openModal = (category = null) => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        powerCapacity: category.powerCapacity || '',
        voltage: category.voltage || '',
        batteryType: category.batteryType || 'Lithium-ion',
        dimensions: category.dimensions || {
          length: '',
          width: '',
          height: '',
          unit: 'mm'
        },
        weight: category.weight || {
          value: '',
          unit: 'g'
        },
        chargingTime: category.chargingTime || '',
        dischargingTime: category.dischargingTime || '',
        isActive: category.isActive,
        image: category.image || ''
      });
      setIsEditing(true);
      setCurrentId(category._id);
    } else {
      setFormData({
        name: '',
        description: '',
        powerCapacity: '',
        voltage: '',
        batteryType: 'Lithium-ion',
        dimensions: {
          length: '',
          width: '',
          height: '',
          unit: 'mm'
        },
        weight: {
          value: '',
          unit: 'g'
        },
        chargingTime: '',
        dischargingTime: '',
        isActive: true,
        image: ''
      });
      setIsEditing(false);
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      powerCapacity: '',
      voltage: '',
      batteryType: 'Lithium-ion',
      dimensions: {
        length: '',
        width: '',
        height: '',
        unit: 'mm'
      },
      weight: {
        value: '',
        unit: 'g'
      },
      chargingTime: '',
      dischargingTime: '',
      isActive: true,
      image: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle nested objects (dimensions and weight)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? (value ? parseFloat(value) : '') : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value ? parseFloat(value) : '') : value
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isEditing) {
        response = await putData(`/categories/${currentId}`, formData);
        toast.success('Category updated successfully');
      } else {
        response = await postData('/categories', formData);
        toast.success('Category created successfully');
      }

      closeModal();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  // Toggle category status (active/inactive)
  const handleToggleStatus = async (id, currentStatus) => {
    setLoading(true);
    setError(null);

    try {
      await putData(`/categories/${id}/status`, { isActive: !currentStatus });
      toast.success(`Category ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Battery type options
  const batteryTypeOptions = [
    'Lithium-ion',
    'Lithium-polymer',
    'Lead-acid',
    'Nickel-cadmium',
    'Nickel-metal hydride',
    'Other'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Battery Category Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" /> Add New Category
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search categories by name or description..."
              onChange={handleSearchChange}
            />
          </div>
          
          <div>
            <select
              name="batteryType"
              value={filters.batteryType}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Battery Types</option>
              {batteryTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="minPower" className="block text-sm font-medium text-gray-700 mb-1">Min Power (mAh)</label>
            <input
              type="number"
              id="minPower"
              name="minPower"
              value={filters.minPower}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Min"
            />
          </div>
          <div>
            <label htmlFor="maxPower" className="block text-sm font-medium text-gray-700 mb-1">Max Power (mAh)</label>
            <input
              type="number"
              id="maxPower"
              name="maxPower"
              value={filters.maxPower}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Max"
            />
          </div>
          <div>
            <label htmlFor="minVoltage" className="block text-sm font-medium text-gray-700 mb-1">Min Voltage (V)</label>
            <input
              type="number"
              id="minVoltage"
              name="minVoltage"
              value={filters.minVoltage}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Min"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="maxVoltage" className="block text-sm font-medium text-gray-700 mb-1">Max Voltage (V)</label>
            <input
              type="number"
              id="maxVoltage"
              name="maxVoltage"
              value={filters.maxVoltage}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Max"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Categories table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Power (mAh)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voltage (V)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && !categories.length ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : !categories.length ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.batteryType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.powerCapacity || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.voltage || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(category)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(category._id, category.isActive)}
                        className={`${category.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {category.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">First</span>
                    <span>«</span>
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${pagination.page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <span>‹</span>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(pagination.pages).keys()].map(number => {
                    const pageNumber = number + 1;
                    // Show current page, and 1 page before and after
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.pages ||
                      (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border ${pagination.page === pageNumber ? 'bg-blue-50 border-blue-500 text-blue-600 z-10' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === 2 ||
                      pageNumber === pagination.pages - 1
                    ) {
                      // Show ellipsis
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${pagination.page === pagination.pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <span>›</span>
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.pages)}
                    disabled={pagination.page === pagination.pages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.page === pagination.pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Last</span>
                    <span>»</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isEditing ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  
                  {/* Basic Information */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Basic Information</h4>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="batteryType" className="block text-sm font-medium text-gray-700">
                        Battery Type *
                      </label>
                      <select
                        id="batteryType"
                        name="batteryType"
                        value={formData.batteryType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {batteryTypeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Technical Specifications */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Technical Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="powerCapacity" className="block text-sm font-medium text-gray-700">
                          Power Capacity (mAh)
                        </label>
                        <input
                          type="number"
                          id="powerCapacity"
                          name="powerCapacity"
                          value={formData.powerCapacity}
                          onChange={handleChange}
                          min="0"
                          step="1"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="voltage" className="block text-sm font-medium text-gray-700">
                          Voltage (V)
                        </label>
                        <input
                          type="number"
                          id="voltage"
                          name="voltage"
                          value={formData.voltage}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Dimensions */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Dimensions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <label htmlFor="dimensions.length" className="block text-sm font-medium text-gray-700">
                          Length
                        </label>
                        <input
                          type="number"
                          id="dimensions.length"
                          name="dimensions.length"
                          value={formData.dimensions.length}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="dimensions.width" className="block text-sm font-medium text-gray-700">
                          Width
                        </label>
                        <input
                          type="number"
                          id="dimensions.width"
                          name="dimensions.width"
                          value={formData.dimensions.width}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="dimensions.height" className="block text-sm font-medium text-gray-700">
                          Height
                        </label>
                        <input
                          type="number"
                          id="dimensions.height"
                          name="dimensions.height"
                          value={formData.dimensions.height}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="dimensions.unit" className="block text-sm font-medium text-gray-700">
                        Unit
                      </label>
                      <select
                        id="dimensions.unit"
                        name="dimensions.unit"
                        value={formData.dimensions.unit}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="mm">Millimeters (mm)</option>
                        <option value="cm">Centimeters (cm)</option>
                        <option value="in">Inches (in)</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Weight */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Weight</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="weight.value" className="block text-sm font-medium text-gray-700">
                          Weight
                        </label>
                        <input
                          type="number"
                          id="weight.value"
                          name="weight.value"
                          value={formData.weight.value}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="weight.unit" className="block text-sm font-medium text-gray-700">
                          Unit
                        </label>
                        <select
                          id="weight.unit"
                          name="weight.unit"
                          value={formData.weight.unit}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="g">Grams (g)</option>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lb">Pounds (lb)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Additional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="chargingTime" className="block text-sm font-medium text-gray-700">
                          Charging Time
                        </label>
                        <input
                          type="text"
                          id="chargingTime"
                          name="chargingTime"
                          value={formData.chargingTime}
                          onChange={handleChange}
                          placeholder="e.g. 2-3 hours"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="dischargingTime" className="block text-sm font-medium text-gray-700">
                          Discharging Time
                        </label>
                        <input
                          type="text"
                          id="dischargingTime"
                          name="dischargingTime"
                          value={formData.dischargingTime}
                          onChange={handleChange}
                          placeholder="e.g. 8-10 hours"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Image URL */}
                  <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;