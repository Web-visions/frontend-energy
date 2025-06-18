import React, { useState, useEffect } from "react";
import FilterSidebar from "../Components/Filters";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productService } from "../services/product.service";
import { useCart } from "../context/CartContext";
import { img_url } from "../config/api_route";
import { no_image } from "../assets";

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    brands: [],
    categories: []
  });
  const [priceRange, setPriceRange] = useState(20000);
  const [selectedFilters, setSelectedFilters] = useState({
    brand: "",
    category: "",
    type: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setSelectedFilters(prev => ({ ...prev, type }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const type = searchParams.get('type');
        const [productsData, filterOptions] = await Promise.all([
          productService.getAllProducts({
            ...selectedFilters,
            type: type || selectedFilters.type,
            minPrice: 0,
            maxPrice: priceRange
          }),
          productService.getFilterOptions()
        ]);
        setProducts(productsData.data);
        setFilters(filterOptions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilters, priceRange, searchParams]);

  const handleReset = () => {
    setPriceRange(20000);
    setSelectedFilters({
      brand: "",
      category: "",
      type: selectedFilters.type // Keep the type filter
    });
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product.type, product._id, 1);
    if (success) {
      // Show success message
    } else {
      // Show error message
    }
  };

  const handleProductClick = async (product) => {
    try {
      console.log('Product data:', product);

      // Get the type from URL query parameter
      const type = searchParams.get('type');
      console.log('Type from URL:', type);

      if (!type) {
        console.error('No type found in URL');
        return;
      }

      console.log('Navigating to:', `/product/${type}/${product._id}`);
      navigate(`/product/${type}/${product._id}`);
    } catch (error) {
      console.error('Error navigating to product:', error);
      setError('Error loading product details');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mt-24 mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onReset={handleReset}
          filterOptions={filters}
        />

        {/* Product Section */}
        <section className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products?.map((prod, index) => (
            <div
              key={prod._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-gray-100 relative"
            >
              {/* Ribbon for top few */}
              {index < 3 && (
                <span className="absolute top-3 left-3 z-10 bg-[#008246]/90 text-[#E4C73F] px-4 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
                  Bestseller
                </span>
              )}
              <div className="h-52 bg-gray-50 relative overflow-hidden">
                {/* Single Image */}
                {(!prod.images || prod.images.length === 0) && (
                  <img
                    src={img_url + prod.image || no_image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                {/* Multiple Images Slider */}
                {prod.images && prod.images.length > 0 && (
                  <div className="relative h-full">
                    <img
                      src={img_url + prod?.image || prod?.images[0] || no_image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {prod.images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {prod.images.map((_, idx) => (
                          <div
                            key={idx}
                            className="w-2 h-2 rounded-full bg-white/50"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleProductClick(prod)}
                    className="bg-[#E4C73F] text-black px-6 py-2 rounded-full font-semibold transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{prod.name}</h3>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-600">Brand: {prod.brand?.name}</p>
                  <p className="text-sm text-gray-600">Category: {prod.category?.name}</p>
                  {/* Show type-specific details based on category */}
                  {prod.category?.name?.toLowerCase() === 'ups' && (
                    <p className="text-sm text-gray-600">Output Power: {prod.outputPowerWattage}W</p>
                  )}
                  {prod.category?.name?.toLowerCase() === 'invertor' && (
                    <p className="text-sm text-gray-600">Capacity: {prod.capacity}VA</p>
                  )}
                  {prod.category?.name?.toLowerCase() === 'solar pcu' && (
                    <p className="text-sm text-gray-600">Wattage: {prod.wattage}W</p>
                  )}
                  {prod.category?.name?.toLowerCase() === 'solar pv' && (
                    <p className="text-sm text-gray-600">Model: {prod.modelName}</p>
                  )}
                  {prod.category?.name?.toLowerCase() === 'solar street light' && (
                    <p className="text-sm text-gray-600">Power: {prod.power}W</p>
                  )}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-[#008246]">
                    ₹{(prod?.price || prod?.sellingPrice || prod?.mrp)?.toLocaleString() || 'Contact for Price'}
                  </p>
                  {prod.mrp > (prod.price || prod.sellingPrice || prod.mrp) && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{prod.mrp.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  className="w-full bg-[#008246] text-white font-semibold py-2 rounded-full hover:bg-[#005a2f] transition mb-2"
                  onClick={() => handleProductClick(prod)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
          {products?.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-lg py-20">
              No products found for selected filters.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
