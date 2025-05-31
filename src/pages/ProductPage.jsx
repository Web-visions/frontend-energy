import React, { useState } from 'react';
import { Sliders as Slider, Battery, Zap, Package, Settings } from 'lucide-react';

const ProductPage = () => {
  const [priceRange, setPriceRange] = useState(20000);
  const products = Array.from({ length: 25 });

  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-8">
      {/* Banner */}
      <div className="w-full h-80 bg-gradient-to-r from-[#008246] to-[#E4C73F] rounded-2xl mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Batteries</h1>
          <p className="text-lg md:text-xl text-center max-w-2xl px-4">
            Discover our extensive collection of high-performance batteries for all your power needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Filter Section */}
        <div className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-[#008246]">Filters</h2>

          {/* Price Range */}
          <div className="mb-8">
            <label className="block mb-3 font-semibold text-gray-700">Price Range</label>
            <input 
              type="range" 
              min="1000" 
              max="20000" 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008246]"
            />
            <div className="flex justify-between text-sm mt-2 text-gray-600">
              <span>₹1,000</span>
              <span>₹{priceRange.toLocaleString()}</span>
            </div>
          </div>

          {/* Filter Groups */}
          {[
            { icon: Battery, label: "Company", options: ["Exide", "Amaron", "Luminous"] },
            { icon: Zap, label: "Voltage", options: ["6V", "12V", "24V"] },
            { icon: Package, label: "Capacity (Ah)", options: ["35Ah", "60Ah", "100Ah"] },
            { icon: Settings, label: "Battery Type", options: ["Lead Acid", "Li-ion", "Tubular"] }
          ].map((filter, index) => (
            <div key={index} className="mb-6">
              <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                <filter.icon size={18} />
                {filter.label}
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-700 focus:border-[#008246] focus:ring-1 focus:ring-[#008246] outline-none transition-all">
                <option value="">All</option>
                {filter.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Right Product Section */}
        <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
            >
              <div className="h-48 bg-gray-50 relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg"
                  alt={`Battery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-[#E4C73F] text-black px-6 py-2 rounded-full font-semibold transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Premium Battery {index + 1}</h3>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-600">Company: Exide</p>
                  <p className="text-sm text-gray-600">Voltage: 12V</p>
                  <p className="text-sm text-gray-600">Capacity: 100Ah</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-[#008246]">₹4,500</p>
                  <span className="text-sm text-gray-500 line-through">₹6,000</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;