import React, { useState, useEffect } from "react";
import FilterSidebar from "../Components/Filters";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productService } from "../services/product.service";
import { useCart } from "../context/CartContext";
import { img_url } from "../config/api_route";
import { no_image } from "../assets";
import { Filter, X } from "lucide-react";

// Helper function to render rating stars
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full_${i}`} className="text-yellow-500">★</span>);
  }

  if (hasHalfStar) {
    stars.push(<span key="half" className="text-gray-300">★</span>);
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(<span key={`empty_${i}`} className="text-gray-300">★</span>);
  }
  return stars;
};

// Skeleton component for a much better loading experience
const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden animate-pulse">
    <div className="w-full h-52 bg-gray-200"></div>
    <div className="p-5 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-2/4"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-lg w-full mt-2"></div>
    </div>
  </div>
);

// Pagination component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center items-center gap-2 my-8">
      <button
        className="px-3 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`px-3 py-1 rounded border ${num === currentPage ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => onPageChange(num)}
          disabled={num === currentPage}
        >
          {num}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { addToCart } = useCart();

  // Get current type from URL
  const currentType = searchParams.get('type') || '';

  // Get current page from URL
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setSelectedFilters(prev => ({ ...prev, type }));
    }
  }, [searchParams]);

  useEffect(() => {
    // Parse query params from URL
    const params = Object.fromEntries([...searchParams]);
    // Set initial filters from URL
    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        brand: params.brand || "",
        category: params.category || "",
      };
      if (params.type && params.type !== "") newFilters.type = params.type;
      return newFilters;
    });
    // Set price range from URL if present
    if (params.minPrice && params.maxPrice) {
      setPriceRange(Number(params.maxPrice));
    }
    // Set page from URL
    if (params.page) {
      setCurrentPage(Number(params.page));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const type = searchParams.get('type');
        // Build filters object, only include type if not empty
        const filtersToSend = { ...selectedFilters, minPrice: 0, maxPrice: priceRange };
        if (type && type !== "") filtersToSend.type = type;
        else delete filtersToSend.type;
        // Add pagination params
        filtersToSend.page = currentPage;
        filtersToSend.limit = 9;
        const [productsData, filterOptions] = await Promise.all([
          productService.getAllProducts(filtersToSend),
          productService.getFilterOptions()
        ]);
        setProducts(productsData.data);
        setFilters(filterOptions);
        // Set pagination info from backend
        if (productsData.pagination) {
          setTotalPages(productsData.pagination.totalPages || 1);
          setCurrentPage(productsData.pagination.page || 1);
        }
        setTotalCount(productsData.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchData();
  }, [selectedFilters, priceRange, searchParams, currentPage]);

  // Filter products by rating if selected
  let filteredProducts = products;
  if (selectedFilters.rating) {
    filteredProducts = filteredProducts.filter(
      (prod) => (prod.averageRating || 0) >= Number(selectedFilters.rating)
    );
  }

  const handleReset = () => {
    setPriceRange(20000);
    setSelectedFilters({
      brand: "",
      category: "",
      type: selectedFilters.type
    });
  };

  const handleProductClick = (product) => {
    console.log(product, "PROD")
    if (!product.prodType) {
      setError('Error loading product details: Product type is missing.');
      return;
    }
    navigate(`/product/${product.prodType?.toLowerCase()}/${product._id}`);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Update URL when filters or page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedFilters.brand) params.set('brand', selectedFilters.brand);
    if (selectedFilters.category) params.set('category', selectedFilters.category);
    if (selectedFilters.type) params.set('type', selectedFilters.type);
    if (selectedFilters.rating) params.set('rating', selectedFilters.rating);
    if (selectedFilters.batteryType) params.set('batteryType', selectedFilters.batteryType);
    params.set('minPrice', 0);
    params.set('maxPrice', priceRange);
    params.set('page', currentPage);
    navigate(`/products?${params.toString()}`, { replace: true });
  }, [selectedFilters, priceRange, currentPage, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center text-red-600 bg-red-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Something Went Wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-screen-xl mt-24 mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block">
            <FilterSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              onReset={handleReset}
              filterOptions={filters}
              currentType={currentType}
            />
          </div>

          {/* Mobile Filter Overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
              <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button
                      onClick={toggleFilter}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    onReset={handleReset}
                    filterOptions={filters}
                  />
                </div>
              </div>
            </div>
          )}

          <section className="w-full">

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : filteredProducts?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod, index) => {
                  console.log(prod, "PROD")
                  const displayPrice = prod?.price || prod?.sellingPrice || prod?.mrp;
                  const hasDiscount = prod.mrp > displayPrice;

                  return (
                    <div
                      key={prod._id}
                      className="relative bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm transition-all duration-300 group flex flex-col"
                    >
                      {index < 3 && (
                        <div className="absolute top-4 left-4 z-10 bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold rounded-full">
                          Bestseller
                        </div>
                      )}

                      <div className="relative w-full h-52 flex items-center justify-center p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
                        <img
                          src={prod.images && prod.images.length > 0 ? (img_url + prod.images[0]) : (img_url + prod.image || no_image)}
                          alt={prod.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-100 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-5 flex-grow flex flex-col">
                        <p className="text-sm text-gray-500 mb-1">{prod.category?.name || 'Category'}</p>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight h-[65px]">{prod.name}</h3>

                        {prod.description && (
                          <p className="text-gray-600 text-sm my-3 line-clamp-3 min-h-[60px]">{prod.description}</p>
                        )}

                        <div className="flex items-center gap-3 my-2">
                          <div className="flex items-center gap-1 text-lg">
                            {renderStars(prod.averageRating)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ({prod.reviewCount || 0} reviews)
                          </div>
                        </div>

                        <div className="mt-auto pt-4">
                          {displayPrice ? (
                            <div className="flex items-baseline gap-2">
                              <p className="text-3xl font-bold text-gray-800">
                                ₹{displayPrice.toLocaleString()}
                              </p>
                              {hasDiscount && (
                                <>
                                  <p className="text-lg text-gray-400 line-through">
                                    ₹{prod.mrp.toLocaleString()}
                                  </p>
                                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                                    {`-${Math.round(((prod.mrp - displayPrice) / prod.mrp) * 100)}% OFF`}
                                  </span>
                                </>
                              )}
                            </div>
                          ) : (
                            <p className="text-lg font-semibold text-blue-600">Contact for Price</p>
                          )}
                        </div>
                      </div>

                      <div className="p-5 border-t border-gray-100 mt-auto">
                        <button
                          className="w-full bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                          onClick={() => handleProductClick(prod)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="col-span-full text-center text-gray-500 py-20 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
            {/* Pagination Bottom */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </section>
        </div>
      </div>

      {/* Mobile Filter Button - Fixed at bottom */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:hidden z-40">
        <button
          onClick={toggleFilter}
          className="bg-green-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-800 transition-all duration-200 flex items-center gap-2 font-semibold"
        >
          <Filter size={20} />
          Filters
        </button>
      </div>
    </div>
  );
}
