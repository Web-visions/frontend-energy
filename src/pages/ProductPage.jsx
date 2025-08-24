import React, { useState, useEffect, useRef } from "react";
import FilterSidebar from "../Components/Filters";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productService } from "../services/product.service";
import { useCart } from "../context/CartContext";
import { img_url } from "../config/api_route";
import { no_image } from "../assets";
import { Filter, X, ChevronLeft, ChevronRight, Star, StarHalf } from "lucide-react";

// Helper function to render rating stars with better design
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full_${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    );
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(
      <Star key={`empty_${i}`} className="w-4 h-4 text-gray-300" />
    );
  }
  return stars;
};

// ✅ Capacity helpers
// "0-50" | "50-100" | "150-200" | "200+"  ->  { minAH, maxAH }
const parseCapacityRange = (range) => {
  if (!range) return { minAH: undefined, maxAH: undefined };
  if (range.endsWith('+')) {
    const min = Number(range.slice(0, -1));
    return { minAH: Number.isFinite(min) ? min : undefined, maxAH: undefined };
  }
  const [minStr, maxStr] = range.split('-');
  const min = Number(minStr);
  const max = Number(maxStr);
  return {
    minAH: Number.isFinite(min) ? min : undefined,
    maxAH: Number.isFinite(max) ? max : undefined,
  };
};

// Enhanced Skeleton component
const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="animate-pulse">
      <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-1/3"></div>
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-4/5"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-full"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-3/4"></div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-1/3"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-1/4"></div>
        </div>
        <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl w-full mt-4"></div>
      </div>
    </div>
  </div>
);

// Enhanced Pagination component with smart page display
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Calculate start and end of middle range
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Add dots after first page if needed
    if (start > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add middle range
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        rangeWithDots.push(i);
      }
    }

    // Add dots before last page if needed
    if (end < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      if (!rangeWithDots.includes(totalPages)) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 my-12">
      <button
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${pageNum === currentPage
                ? "bg-green-600 text-white shadow-lg transform scale-105"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                }`}
              onClick={() => onPageChange(pageNum)}
              disabled={pageNum === currentPage}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brands: [], categories: [] });
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedFilters, setSelectedFilters] = useState({
    brand: "",
    category: "",
    type: "",
    rating: undefined,
    batteryType: undefined,
    capacityRange: "",
    productLine: "",
    manufacturer: "",
    vehicleModel: "",
    state: "",
    city: "",
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  const isFirstLoad = useRef(true);

  useEffect(() => {
    const paramsObj = Object.fromEntries([...searchParams]);
    const urlFilters = {
      brand: paramsObj.brand || "",
      category: paramsObj.category || "",
      type: paramsObj.type || "",
      rating: paramsObj.rating || undefined,
      batteryType: paramsObj.batteryType || undefined,
      capacityRange: paramsObj.capacityRange || "",
      productLine: paramsObj.productLine || "",
      manufacturer: paramsObj.manufacturer || "",
      vehicleModel: paramsObj.vehicleModel || "",
      state: paramsObj.state || "",
      city: paramsObj.city || "",
    };

    const urlPriceMax = paramsObj.maxPrice ? Number(paramsObj.maxPrice) : 20000;
    const urlPage = paramsObj.page ? Number(paramsObj.page) : 1;

    setSelectedFilters(urlFilters);
    setSelectedSubcategory(paramsObj.subcategory || "");
    setPriceRange(urlPriceMax);
    setCurrentPage(urlPage);
  }, [searchParams]);


  const typeBrandMap = {
    inverter: ["Su-vastika", "Luminous", "Microtek"],
    battery: [
      "Exide",
      "Luminous",
      "Bi Cell",
      "SF Batteries",
      "Amaron",
      "Dynex",
      "Livfast",
    ],
    ups: ["APC", "Su-vastika", "Luminous", "Microtek"],
    solar: ["Usha Shriram", "Warree", "Vikram", "Adani"],
  };

  const batteryTypeMap = {
    exide: ["lead acid", "li-ion", "smf"],
    luminous: ["lead acid"],
    "bi cell": ["lead acid"],
    "sf batteries": ["lead acid"],
    amaron: ["lead acid", "smf"],
    livfast: ["lead acid"],
  };

  const normalizedType = selectedFilters.type?.toLowerCase().trim() || "";
  let allowedBrandNames = [];

  if (normalizedType.split("-")[0] === "solar") {
    allowedBrandNames = typeBrandMap["solar"];
  } else {
    allowedBrandNames = typeBrandMap[normalizedType] || [];
  }

  const filteredBrandList =
    allowedBrandNames.length > 0
      ? filters.brands.filter((brand) =>
        allowedBrandNames
          .map((name) => name.toLowerCase().trim())
          .includes(brand.name.toLowerCase().trim())
      )
      : filters.brands;

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (selectedFilters.brand) params.set("brand", selectedFilters.brand);
    if (selectedFilters.category) params.set("category", selectedFilters.category);
    if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
    if (selectedFilters.type) params.set("type", selectedFilters.type);
    if (selectedFilters.rating) params.set("rating", selectedFilters.rating);
    if (selectedFilters.batteryType) params.set("batteryType", selectedFilters.batteryType);
    if (selectedFilters.productLine) params.set("productLine", selectedFilters.productLine);
    if (selectedFilters.manufacturer) params.set("manufacturer", selectedFilters.manufacturer);
    if (selectedFilters.vehicleModel) params.set("vehicleModel", selectedFilters.vehicleModel);
    if (selectedFilters.state) params.set("state", selectedFilters.state);
    if (selectedFilters.city) params.set("city", selectedFilters.city);

    if (selectedFilters.capacityRange) {
      params.set("capacityRange", selectedFilters.capacityRange);

      const { minAH, maxAH } = parseCapacityRange(selectedFilters.capacityRange);
      if (minAH !== undefined) params.set("minAH", String(minAH));
      if (maxAH !== undefined) params.set("maxAH", String(maxAH));
    }
    params.set("minPrice", 0);
    params.set("maxPrice", priceRange);
    params.set("page", currentPage);

    const newUrl = `/products?${params.toString()}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      navigate(newUrl, { replace: true });
    }
  }, [selectedFilters, selectedSubcategory, priceRange, currentPage, navigate]);

  useEffect(() => {
    const fetchProductsAndFilters = async () => {
      try {
        setLoading(true);

        const paramsObj = Object.fromEntries([...searchParams]);

        // capacity handling
        const explicitMinAH = paramsObj.minAH ? Number(paramsObj.minAH) : undefined;
        const explicitMaxAH = paramsObj.maxAH ? Number(paramsObj.maxAH) : undefined;
        const derivedRange = parseCapacityRange(paramsObj.capacityRange || "");
        const minAH = explicitMinAH ?? derivedRange.minAH;
        const maxAH = explicitMaxAH ?? derivedRange.maxAH;

        const requestFilters = {
          brand: paramsObj.brand || "",
          category: paramsObj.category || "",
          subcategory: paramsObj.subcategory || "",
          type: paramsObj.type || "",
          rating: paramsObj.rating || undefined,
          batteryType: paramsObj.batteryType || undefined,
          capacityRange: paramsObj.capacityRange || undefined,
          minAH,
          maxAH,
          minPrice: paramsObj.minPrice ? Number(paramsObj.minPrice) : 0,
          maxPrice: paramsObj.maxPrice ? Number(paramsObj.maxPrice) : 20000,
          page: paramsObj.page ? Number(paramsObj.page) : 1,
          limit: 8,

          // NEW: from Product Finder
          productLine: paramsObj.productLine || "",
          manufacturer: paramsObj.manufacturer || "",
          vehicleModel: paramsObj.vehicleModel || "",
          state: paramsObj.state || "",
          city: paramsObj.city || "",
        };

        // strip empties
        Object.keys(requestFilters).forEach((key) => {
          if (requestFilters[key] === "" || requestFilters[key] === undefined) {
            delete requestFilters[key];
          }
        });

        const [productsResponse, filterOptionsResponse] = await Promise.all([
          productService.getAllProducts(requestFilters),
          productService.getFilterOptions(),
        ]);

        setProducts(productsResponse.data);
        setFilters(filterOptionsResponse);

        setTotalPages(productsResponse.pagination?.totalPages || 1);
        setTotalCount(productsResponse.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchProductsAndFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, selectedFilters.capacityRange]);


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
      type: selectedFilters.type,
      capacityRange: "",
    });
    setCurrentPage(1);
  };

  const handleProductClick = (product) => {
    if (!product.prodType) {
      setError("Error loading product details: Product type is missing.");
      return;
    }
    navigate(`/product/${product.prodType?.toLowerCase()}/${product._id}`);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const selectedBrandObj = filters.brands.find(
    (b) => b._id === selectedFilters.brand
  );

  const selectedBrandName = selectedBrandObj ? selectedBrandObj.name.trim().toLowerCase() : '';

  const allowedBatteryTypes =
    selectedFilters.type === "battery" && selectedBrandName
      ? batteryTypeMap[selectedBrandName] || []
      : [];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-red-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something Went Wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            {totalCount > 0 ? `Showing ${totalCount} products` : 'Discover our range of products'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                onReset={handleReset}
                filterOptions={{
                  ...filters,
                  brands: filteredBrandList,
                  batteryTypes: allowedBatteryTypes.length
                    ? allowedBatteryTypes.map(bt => ({
                      value: bt,
                      label: bt.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
                    }))
                    : filters.batteryTypes,
                }}
                currentType={searchParams.get("type") || ""}
              />

            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Filters</h2>
                    <button
                      onClick={toggleFilter}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                      <X size={24} className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <FilterSidebar
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    onReset={handleReset}
                    filterOptions={{
                      ...filters,
                      brands: filteredBrandList,
                      batteryTypes: allowedBatteryTypes.length
                        ? allowedBatteryTypes.map(bt => ({
                          value: bt,
                          label: bt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                        }))
                        : filters.batteryTypes,
                    }}
                    currentType={searchParams.get("type") || ""}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <section className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredProducts.map((prod, index) => {
                    const displayPrice = prod.category?.name?.toLowerCase() === 'battery'
                      ? (prod?.priceWithoutOldBattery || prod?.sellingPrice || prod?.price || prod?.mrp)
                      : (prod?.price || prod?.sellingPrice || prod?.mrp);
                    const hasDiscount = prod.mrp && displayPrice && prod.mrp > displayPrice;
                    const discountPercentage = hasDiscount
                      ? Math.round(((prod.mrp - displayPrice) / prod.mrp) * 100)
                      : 0;

                    return (
                      <div
                        key={prod._id}
                        className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-10 flex flex-row justify-between w-[95%] sm:w-[90%] gap-2">

                          {hasDiscount && (
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                              -{discountPercentage}% OFF
                            </div>
                          )}
                          {index < 3 && (
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                              ⭐ Bestseller
                            </div>
                          )}
                        </div>

                        {/* Product Image */}
                        <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                          <img
                            src={
                              prod.images && prod.images.length > 0
                                ? img_url + prod.images[0]
                                : img_url + prod.image || no_image
                            }
                            alt={prod.name || 'Product image'}
                            className="max-w-full max-h-full object-contain transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="mb-2">
                            <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                              {prod.category?.name || "Product"}
                            </p>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 line-clamp-3 leading-tight mb-3 min-h-[3.5rem]">
                            {prod.name}
                          </h3>

                          {prod.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[4rem]">
                              {prod.description}
                            </p>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              {renderStars(prod.averageRating || 0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {(prod.averageRating || 0).toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({prod.reviewCount || 0} reviews)
                            </span>
                          </div>

                          {/* Price */}
                          <div className="mt-auto">
                            {displayPrice ? (
                              <div className="mb-4">
                                <div className="flex items-baseline gap-2">
                                  <p className="text-2xl font-bold text-gray-900">
                                    ₹{displayPrice.toLocaleString()}
                                  </p>
                                  {/* Show strikethrough for ALL products that have discount */}
                                  {hasDiscount && (
                                    <p className="text-lg text-gray-400 line-through">
                                      ₹{prod.mrp.toLocaleString()}
                                    </p>
                                  )}
                                </div>

                                {/* Battery Exchange Options - Show if any exchange price exists */}
                                {prod.category?.name?.toLowerCase() === 'battery' &&
                                  (prod.priceWithOldBattery || prod.priceWithoutOldBattery) && (
                                    <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                      {prod.priceWithoutOldBattery && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600">Without Exchange:</span>
                                          <span className="font-semibold text-gray-900">
                                            ₹{prod.priceWithoutOldBattery.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                      {prod.priceWithOldBattery && (
                                        <div className="flex justify-between items-center border-t pt-2">
                                          <span className="text-green-600 font-medium">With Old Battery:</span>
                                          <span className="font-bold text-green-600">
                                            ₹{prod.priceWithOldBattery.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <p className="text-lg font-semibold text-blue-600 mb-4">
                                Contact for Price
                              </p>
                            )}



                            <button
                              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              onClick={() => handleProductClick(prod)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Filter className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 mb-8">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 lg:hidden z-40">
        <button
          onClick={toggleFilter}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full shadow-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-3 font-bold text-lg hover:scale-105"
        >
          <Filter size={24} />
          Filters
          {Object.values(selectedFilters).some(v => v) && (
            <span className="bg-white text-green-700 text-sm px-2 py-1 rounded-full font-bold">
              Active
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
