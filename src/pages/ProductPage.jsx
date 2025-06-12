import React, { useState } from "react";
import FilterSidebar from "../Components/Filters";
import { useNavigate } from "react-router-dom";

const fakeProducts = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  name: `Premium Battery ${i + 1}`,
  company: ["Exide", "Amaron", "Luminous"][i % 3],
  voltage: ["6V", "12V", "24V"][i % 3],
  capacity: ["35Ah", "60Ah", "100Ah"][i % 3],
  type: ["Lead Acid", "Li-ion", "Tubular"][i % 3],
  price: 4500 + (i % 5) * 500,
  oldPrice: 6000,
  image: "https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg",
}));

const defaultFilterState = {
  Company: "",
  Voltage: "",
  "Capacity (Ah)": "",
  "Battery Type": "",
};

export default function ProductListing() {
  const [priceRange, setPriceRange] = useState(20000);
  const [selectedFilters, setSelectedFilters] = useState(defaultFilterState);
  const navigate = useNavigate();
  
  const handleReset = () => {
    setPriceRange(20000);
    setSelectedFilters(defaultFilterState);
  };

  const filteredProducts = fakeProducts.filter(
    (p) =>
      (!selectedFilters.Company || p.company === selectedFilters.Company) &&
      (!selectedFilters.Voltage || p.voltage === selectedFilters.Voltage) &&
      (!selectedFilters["Capacity (Ah)"] || p.capacity === selectedFilters["Capacity (Ah)"]) &&
      (!selectedFilters["Battery Type"] || p.type === selectedFilters["Battery Type"]) &&
      p.price <= priceRange
  );

  return (
    <div className="max-w-[1280px] mt-24 mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onReset={handleReset}
        />

        {/* Product Section */}
        <section className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((prod, index) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-gray-100 relative"
            >
              {/* Ribbon for top few */}
              {index < 3 && (
                <span className="absolute top-3 left-3 z-10 bg-[#008246]/90 text-[#E4C73F] px-4 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
                  Bestseller
                </span>
              )}
              <div className="h-52 bg-gray-50 relative overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-[#E4C73F] text-black px-6 py-2 rounded-full font-semibold transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{prod.name}</h3>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-600">Company: {prod.company}</p>
                  <p className="text-sm text-gray-600">Voltage: {prod.voltage}</p>
                  <p className="text-sm text-gray-600">Capacity: {prod.capacity}</p>
                  <p className="text-sm text-gray-600">Type: {prod.type}</p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-[#008246]">₹{prod.price.toLocaleString()}</p>
                  <span className="text-sm text-gray-500 line-through">₹{prod.oldPrice.toLocaleString()}</span>
                </div>
                <button
                  className="w-full bg-[#008246] text-white font-semibold py-2 rounded-full hover:bg-[#005a2f] transition mb-2"
                  onClick={() => navigate('/product-detail')}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-lg py-20">
              No products found for selected filters.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
