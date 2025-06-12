import React from "react";
import { Battery, Zap, Package, Settings } from "lucide-react";

const FILTERS = [
  { icon: Battery, label: "Company", options: ["Exide", "Amaron", "Luminous"] },
  { icon: Zap, label: "Voltage", options: ["6V", "12V", "24V"] },
  { icon: Package, label: "Capacity (Ah)", options: ["35Ah", "60Ah", "100Ah"] },
  { icon: Settings, label: "Battery Type", options: ["Lead Acid", "Li-ion", "Tubular"] },
];

export default function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedFilters,
  setSelectedFilters,
  onReset,
}) {
  return (
    <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-8 self-start z-20">
      <h2 className="text-2xl font-bold mb-6 text-[#008246]">Filters</h2>

      {/* Price Range */}
      <div className="mb-8">
        <label className="block mb-3 font-semibold text-gray-700">Price Range</label>
        <input
          type="range"
          min="1000"
          max="20000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008246]"
        />
        <div className="flex justify-between text-sm mt-2 text-gray-600">
          <span>₹1,000</span>
          <span>₹{Number(priceRange).toLocaleString()}</span>
        </div>
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
              setSelectedFilters((f) => ({
                ...f,
                [filter.label]: e.target.value,
              }))
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

      <button
        className="w-full bg-[#E4C73F] text-[#008246] font-bold py-2 rounded-lg shadow hover:bg-[#ffe477] hover:text-black transition-all mt-4"
        onClick={onReset}
        type="button"
      >
        Reset Filters
      </button>
    </aside>
  );
}
