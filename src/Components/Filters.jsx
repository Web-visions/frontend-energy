import React from "react";
import { Battery, Zap, Package, Settings } from "lucide-react";

const FILTERS = [
  { icon: Battery, label: "Company", options: ["Exide", "Amaron", "Luminous"] },
  { icon: Zap, label: "Voltage", options: ["6V", "12V", "24V"] },
  { icon: Package, label: "Capacity (Ah)", options: ["35Ah", "60Ah", "100Ah"] },
  { icon: Settings, label: "Battery Type", options: ["Lead Acid", "Li-ion", "Tubular"] },
];

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  selectedFilters,
  setSelectedFilters,
  onReset,
  filterOptions
}) => {
  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-8 self-start z-20">
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
          max="20000"
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

      {/* Category Filter */}
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

      {/* Type Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Product Type</h3>
        <select
          value={selectedFilters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="ups">UPS</option>
          <option value="solar-pcu">Solar PCU</option>
          <option value="solar-pv">Solar PV Module</option>
          <option value="solar-street-light">Solar Street Light</option>
          <option value="inverter">Inverter</option>
          <option value="battery">Battery</option>
        </select>
      </div>

      {FILTERS.map((filter) => (
        <div key={filter.label} className="mb-6">
          <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
            <filter.icon size={18} />
            {filter.label}
          </label>
          <select
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-700 focus:border-[#008246] focus:ring-1 focus:ring-[#008246] outline-none transition-all"
            value={selectedFilters[filter.label] || ""}
            onChange={(e) =>
              handleFilterChange(filter.label, e.target.value)
            }
          >
            <option value="">All</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </aside>
  );
};

export default FilterSidebar;
