import React from "react";
import { RotateCcw, Filter, Star } from "lucide-react";

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

  // Count active filters
  const activeFiltersCount = Object.values(selectedFilters).filter(value => 
    value && value !== ""
  ).length + (priceRange !== 20000 ? 1 : 0);

  return (
    <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-green-700 text-white p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold">Filters</h2>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white bg-opacity-25 bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-green-600"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Reset All</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Price Range */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Price Range
          </h3>
          <div className="bg-gray-50 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-gray-200">
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 sm:h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(priceRange/100000)*100}%, #E5E7EB ${(priceRange/100000)*100}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between items-center mt-2 sm:mt-3">
              <span className="text-xs sm:text-sm font-medium text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full border text-center">
                ₹0
              </span>
              <span className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 bg-blue-50 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full border border-blue-200 text-center">
                ₹{priceRange.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Brand
          </h3>
          <div className="relative">
            <select
              value={selectedFilters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none font-medium text-gray-900 text-sm sm:text-base"
            >
              <option value="">All Brands</option>
              {filterOptions.brands?.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter: only show if not on a specific type */}
        {(!currentType || currentType === '') && (
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Category
            </h3>
            <div className="relative">
              <select
                value={selectedFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none font-medium text-gray-900 text-sm sm:text-base"
              >
                <option value="">All Categories</option>
                {filterOptions.categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Battery Type Filter: only show if on battery type */}
        {currentType === 'battery' && (
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              Battery Type
            </h3>
            <div className="relative">
              <select
                value={selectedFilters.batteryType || ''}
                onChange={(e) => handleFilterChange('batteryType', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none font-medium text-gray-900 text-sm sm:text-base"
              >
                <option value="">All Types</option>
                {batteryTypeOptions.map((opt) => (
                  <option key={opt.value || opt} value={opt.value || opt}>
                    {opt.label || opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

{/* Battery Capacity Filter */}
{currentType === 'battery' && (
  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
    <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
      <span className="w-2 h-2 bg-red-600 rounded-full"></span>
      Battery Capacity
    </h3>
    <div className="relative">
      <select
        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none font-medium text-gray-900 text-sm sm:text-base"
        value={selectedFilters.capacityRange || ''}
        onChange={(e) =>
          setSelectedFilters(prev => ({ ...prev, capacityRange: e.target.value }))
        }
      >
        <option value="">All Capacities</option>
        <option value="0-99">&lt; 100Ah</option>
        <option value="100-150">100Ah–150Ah</option>
        <option value="151-200">150Ah–200Ah</option>
        <option value="201-999">&gt; 200Ah</option>
      </select>
      <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
)}


        {/* Inverter Capacity Filter */}
   {/* Inverter Capacity Filter */}
   {currentType === 'inverter' && (
  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
    <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
      <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
      Inverter Capacity
    </h3>
    <div className="relative">
      <select
        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none font-medium text-gray-900 text-sm sm:text-base"
        value={selectedFilters.capacityRange || ''}
        onChange={(e) =>
          setSelectedFilters(prev => ({ ...prev, capacityRange: e.target.value }))
        }
      >
        <option value="">All Capacities</option>
        <option value="0-799">&lt; 800VA</option>
        <option value="800-1499">800VA–1.5KVA</option>
        <option value="1500-2499">1.5KVA–2.5KVA</option>
        <option value="2500-4999">2.5KVA–5KVA</option>
        <option value="5000-999999">&gt; 5KVA</option>
      </select>
      <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
)}


        {/* Rating Filter */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
            Rating
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              { value: '', label: 'All Ratings' },
              { value: '4', label: '4★ & above' },
              { value: '3', label: '3★ & above' },
              { value: '2', label: '2★ & above' },
              { value: '1', label: '1★ & above' }
            ].map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={option.value}
                  checked={selectedFilters.rating === option.value || (!selectedFilters.rating && option.value === '')}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mr-2 sm:mr-3 transition-all duration-200 ${
                  selectedFilters.rating === option.value || (!selectedFilters.rating && option.value === '')
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {(selectedFilters.rating === option.value || (!selectedFilters.rating && option.value === '')) && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`font-medium text-xs sm:text-sm lg:text-base flex-1 ${
                  selectedFilters.rating === option.value || (!selectedFilters.rating && option.value === '')
                    ? 'text-blue-600' 
                    : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
                {option.value && (
                  <div className="ml-auto flex">
                    {Array.from({ length: parseInt(option.value) }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            {activeFiltersCount > 0 ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied` : 'No filters applied'}
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="w-full bg-green-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        
        @media (min-width: 640px) {
          .slider::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
            border: 3px solid #ffffff;
            box-shadow: 0 3px 6px rgba(59, 130, 246, 0.3);
          }
        }
        
        @media (min-width: 1024px) {
          .slider::-webkit-slider-thumb {
            height: 24px;
            width: 24px;
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
          }
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        
        @media (min-width: 640px) {
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border: 3px solid #ffffff;
            box-shadow: 0 3px 6px rgba(59, 130, 246, 0.3);
          }
        }
        
        @media (min-width: 1024px) {
          .slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>
    </aside>
  );
};

export default FilterSidebar;
