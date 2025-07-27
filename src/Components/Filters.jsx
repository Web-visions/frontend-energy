import React from "react";

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  selectedFilters,
  setSelectedFilters,
  onReset,
  filterOptions,
  currentType // pass from ProductPage.jsx, e.g. 'battery', 'ups', etc. or ''
}) => {
  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Battery type options: dynamic from filterOptions, fallback to enum
  const batteryTypeOptions = filterOptions.batteryTypes || [
    { value: 'lead acid', label: 'Lead Acid' },
    { value: 'li ion', label: 'Li-ion' },
    { value: 'smf', label: 'SMF' }
  ];

  return (
    <aside className="w-[15rem] bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <input
          type="range"
          min="0"
          max="100000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">₹0</span>
          <span className="text-sm text-gray-600">₹{priceRange.toLocaleString()}</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
        <select
          value={selectedFilters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Brands</option>
          {filterOptions.brands?.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter: only show if not on a specific type */}
      {(!currentType || currentType === '') && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Category</h3>
          <select
            value={selectedFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {filterOptions.categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Product Type Filter: only show if not on a specific type */}
      {/* {(!currentType || currentType === '') && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Product Type</h3>
          <select
            value={selectedFilters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {filterOptions.types?.map((type) => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
      )} */}

      {/* Battery Type Filter: only show if on battery type */}
      {currentType === 'battery' && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Battery Type</h3>
          <select
            value={selectedFilters.batteryType || ''}
            onChange={(e) => handleFilterChange('batteryType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {batteryTypeOptions.map((opt) => (
              <option key={opt.value || opt} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        </div>
      )}

{selectedFilters.type === 'battery' && (
  <div className="mb-4">
    <label className="font-semibold text-sm text-gray-700 mb-2 block">Capacity (AH)</label>
    <select
      className="w-full border border-gray-300 rounded p-2"
      value={selectedFilters.capacity || ''}
      onChange={(e) =>
        setSelectedFilters(prev => ({ ...prev, capacity: e.target.value }))
      }
    >
      <option value="">All</option>
      {[35, 65, 80, 100, 120, 135, 150, 165, 180, 200].map((ah) => (
        <option key={ah} value={ah}>{ah} AH</option>
      ))}
    </select>
  </div>
)}

{selectedFilters.type === 'inverter' && (
  <div className="mb-4">
    <label className="font-semibold text-sm text-gray-700 mb-2 block">Capacity (VA)</label>
    <select
      className="w-full border border-gray-300 rounded p-2"
      value={selectedFilters.capacity || ''}
      onChange={(e) =>
        setSelectedFilters(prev => ({ ...prev, capacity: e.target.value }))
      }
    >
      <option value="">All</option>
      {[600, 800, 1000, 1100, 1500, 2000, 2200, 3000].map((va) => (
        <option key={va} value={va}>{va} VA</option>
      ))}
    </select>
  </div>
)}

      {/* Rating Filter: always show */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
        <select
          value={selectedFilters.rating || ''}
          onChange={(e) => handleFilterChange('rating', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
          <option value="2">2★ & above</option>
          <option value="1">1★ & above</option>
        </select>
      </div>
    </aside>
  );
};

export default FilterSidebar;
