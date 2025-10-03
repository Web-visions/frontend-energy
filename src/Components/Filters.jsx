import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw, Filter } from "lucide-react";
import debounce from "lodash/debounce";

/* -------------------- BRAND MAPPING CONSTANTS -------------------- */

const BRAND_ALIAS_MAP = {
  amron: "Amaron",
  amaron: "Amaron",
  excide: "Exide",
  exide: "Exide",
  "sf sonic": "SF Batteries",
  "sf batteries": "SF Batteries",
  dynax: "Dynex",
  dynex: "Dynex",
  livguard: "Livfast",
  livgurard: "Livfast",
  livegurard: "Livfast",
  livfast: "Livfast",
  microtk: "Microtek",
  microke: "Microtek",
  microtek: "Microtek",
  luminous: "Luminous",
  apc: "APC",
  vikram: "Vikram",
  warree: "Warree",
  "usha shriram": "Usha Shriram",
  "bi cell": "Bi Cell",
  "su-vastika": "Su-vastika",
  adani: "Adani",
};

const PRODUCT_LINE_TO_BRANDS = {
  "2 Wheeler Batteries": ["Amaron", "Exide", "SF Batteries"],
  "Four Wheeler Batteries": ["Amaron", "Exide", "SF Batteries"],
  "Truck Batteries": ["Amaron", "SF Batteries", "Exide", "Bi Cell"],
  "Genset Batteries": ["Exide", "Bi Cell", "Amron"],
  "Inverter & Battery Combo": ["Amaron", "Exide", "Luminous", "Microtek", "Bi Cell"],
  "Inverter & UPS System": ["Exide", "Luminous", "Microtek"],
  "Inverter Batteries": ["Amaron", "Exide", "Livfast", "Luminous", "Microtek", "SF Batteries", "Bi Cell", "Okaya", "Amaze"],
  "SMF/VRLA Batteries": ["Amaron", "Exide"],
  "Solar Batteries": ["Exide", "Luminous", "Bi Cell"],
  "Solar Energy Solutions": ["Luminous", "Microtek"],
  "Solar Inverters": ["Luminous", "Microtek", "Su-vastika"],
  "Online UPS": ["Microtek", "APC", "Su-vastika", "Luminous"],
  Inverter: ["Su-vastika", "Livguard", "Luminous", "Microtek"],
};

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const getCanonicalBrandName = (brandName) => {
  const key = normalize(brandName);
  return BRAND_ALIAS_MAP[key] || brandName;
};

const getAllowedBrandNamesForProductLine = (productLineName) => {
  const allowed = PRODUCT_LINE_TO_BRANDS[productLineName] || [];
  return allowed.map(getCanonicalBrandName);
};

/* -------------------- CAPACITY OPTIONS HELPERS -------------------- */

const generateInverterAhOptions = () => {
  const options = [];
  for (let ah = 100; ah <= 260; ah += 10) {
    options.push({ value: `${ah}`, label: `${ah} AH` });
  }
  return options;
};

const GENERIC_CAPACITY_OPTIONS_AH = [
  { value: "0-50", label: "0 - 50 AH" },
  { value: "51-100", label: "51 - 100 AH" },
  { value: "101-150", label: "101 - 150 AH" },
  { value: "151-200", label: "151 - 200 AH" },
  { value: "200+", label: "200+ AH" },
];

const DEFAULT_CAPACITY_OPTIONS_VA = [
  { value: "0-1000", label: "≤ 1 kVA (≤ 1000 VA)" },
  { value: "1001-2000", label: "1–2 kVA" },
  { value: "2001-3000", label: "2–3 kVA" },
  { value: "3001-5000", label: "3–5 kVA" },
  { value: "5000+", label: "> 5 kVA" },
];

const getAhCapacityOptionsForProductLine = (productLineName) => {

  if (!productLineName) return GENERIC_CAPACITY_OPTIONS_AH;

  if (productLineName === "SMF/VRLA Batteries") {
    return [
      { value: "4.5-10", label: "4.5 - 10 AH" },
      { value: "11-50", label: "11 - 50 AH" },
      { value: "51-100", label: "51 - 100 AH" },
      { value: "101-150", label: "101 - 150 AH" },
      { value: "151-200", label: "151 - 200 AH" },
      { value: "200+", label: "200+ AH" },
    ];
  }

  if (productLineName === "Solar Batteries") {
    return [
      { value: "100", label: "100 AH" },
      { value: "150", label: "150 AH" },
    ];
  }

  if (productLineName === "Genset Batteries") {
    return [
      { value: "90", label: "90 AH" },
      { value: "105", label: "105 AH" },
    ];
  }


 

  return GENERIC_CAPACITY_OPTIONS_AH;
};

const getVaCapacityOptionsForProductLine = (productLineName) => {
  if (!productLineName) return DEFAULT_CAPACITY_OPTIONS_VA;

   if (productLineName === "Inverter Batteries") {
    return generateInverterAhOptions();
  }
  if (productLineName === "Online UPS") {
    return [{ value: "705", label: "705 VA" }];
  //   return [{ value: "0-1000", label: "≤ 1 kVA (≤ 1000 VA)" },
  // { value: "1001-2000", label: "1–2 kVA" },
  // { value: "2001-3000", label: "2–3 kVA" },
  // { value: "3001-5000", label: "3–5 kVA" },
  // { value: "5000+", label: "> 5 kVA" },]
  }

  return DEFAULT_CAPACITY_OPTIONS_VA;
};

/* -------------------- MAIN COMPONENT -------------------- */

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  selectedFilters,
  setSelectedFilters,
  onReset,
  filterOptions,
  currentType,
}) => {
  const [displayedPrice, setDisplayedPrice] = useState(priceRange);

  useEffect(() => {
    setDisplayedPrice(priceRange);
  }, [priceRange]);

  const notifyParentDebounced = useMemo(
    () =>
      debounce((nextPrice) => {
        setPriceRange(nextPrice);
      }, 500),
    [setPriceRange]
  );

  useEffect(() => {
    return () => {
      notifyParentDebounced.cancel();
    };
  }, [notifyParentDebounced]);

  const handleSliderChange = (event) => {
    const nextPrice = Number(event.target.value);
    setDisplayedPrice(nextPrice);
    notifyParentDebounced(nextPrice);
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // URL params for product line detection
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const productLineId = urlParams.get("productLine");
  const productLineNameFromUrl = urlParams.get("productLineName");
  const typeFromUrl = urlParams.get("type"); // type=inverter, battery, ups
  const capacityRangeFromUrl = urlParams.get("capacityRange");
  
  const hasManufacturer = urlParams.has("manufacturer") && urlParams.get("manufacturer");
  const hasVehicleModel = urlParams.has("vehicleModel") && urlParams.get("vehicleModel");
  const hasProductLine = urlParams.has("productLine") && urlParams.get("productLine");
  const shouldShowCapacity = hasManufacturer || hasVehicleModel || hasProductLine || typeFromUrl;

  // Get product line name from URL (preferred) or fallback to filterOptions
  const productLineName = useMemo(() => {
    // Pehle URL se try karo
    if (productLineNameFromUrl) return productLineNameFromUrl;
    
    // Fallback: filterOptions se dhundo
    if (!productLineId || !filterOptions.productLines) return "";
    const found = filterOptions.productLines.find((pl) => pl._id === productLineId);
    return found ? found.name : "";
  }, [productLineNameFromUrl, filterOptions.productLines, productLineId]);

  // Filter brands based on product line
  const filteredBrands = useMemo(() => {
    if (!productLineName) {
      return filterOptions.brands || [];
    }

    const allowed = new Set(
      getAllowedBrandNamesForProductLine(productLineName).map(normalize)
    );

    return (filterOptions.brands || []).filter((brand) =>
      allowed.has(normalize(getCanonicalBrandName(brand.name)))
    );
  }, [filterOptions.brands, productLineName]);

  // Determine capacity unit (AH or VA) based on product line name OR type
  const EXPLICIT_VA_PRODUCT_LINES = useMemo(
    () =>
      new Set([
        "Inverter",
        "Inverter & UPS System",
        "Inverter & Battery Combo",
        "Solar Inverters",
        "Computer UPS",
        "Solar Energy Solutions",
        "Online UPS",
      ]),
    []
  );

  const capacityUnit = useMemo(() => {
    // Check type from URL first
    if (typeFromUrl) {
      if (typeFromUrl === "inverter" || typeFromUrl === "ups" || typeFromUrl === "online-ups" || typeFromUrl === "solar-pcu") {
        return "VA";
      }
      if (typeFromUrl === "battery") {
        return "AH";
      }
    }

    // Check product line name
    if (!productLineName) return "AH";
    const lowerName = productLineName.toLowerCase();
    
    // Check if it's a VA product line
    if (EXPLICIT_VA_PRODUCT_LINES.has(productLineName)) return "VA";
    if (lowerName.includes("ups")) return "VA";
    if (lowerName.includes("inverter") && !lowerName.includes("battery")) return "VA";
    
    // Everything else is AH (all battery types)
    return "AH";
  }, [productLineName, typeFromUrl, EXPLICIT_VA_PRODUCT_LINES]);

  // Get capacity options based on product line and unit
  const capacityOptions = useMemo(() => {
    if (capacityUnit === "VA") {
      return getVaCapacityOptionsForProductLine(productLineName);
    }
    return getAhCapacityOptionsForProductLine(productLineName);
  }, [productLineName, capacityUnit]);

  // Sync capacity from URL to selectedFilters when component mounts or URL changes
  useEffect(() => {
  if (capacityRangeFromUrl) {
    setSelectedFilters((prev) => ({
      ...prev,
      capacity: capacityRangeFromUrl,
      capacityRange: capacityRangeFromUrl,
    }));
  }
}, [capacityRangeFromUrl, setSelectedFilters]); 

  const batteryTypeOptions = filterOptions.batteryTypes || [
    { value: "lead acid", label: "Lead Acid" },
    { value: "li ion", label: "Li-ion" },
    { value: "smf", label: "SMF" },
  ];

  const activeFiltersCount =
    Object.values(selectedFilters).filter((value) => value && value !== "")
      .length + (displayedPrice !== 100000 ? 1 : 0);

  return (
    <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-green-700 text-white p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold">
              Filters
            </h2>
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
              value={displayedPrice}
              onChange={handleSliderChange}
              className="w-full h-2 sm:h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                  (displayedPrice / 100000) * 100
                }%, #E5E7EB ${(displayedPrice / 100000) * 100}%, #E5E7EB 100%)`,
              }}
            />
            <div className="flex justify-between items-center mt-2 sm:mt-3">
              <span className="text-xs sm:text-sm font-medium text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full border text-center">
                ₹0
              </span>
              <span className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 bg-blue-50 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full border border-blue-200 text-center">
                ₹{displayedPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Brand
          </h3>
          <div className="relative">
            <select
              value={selectedFilters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none font-medium text-gray-900 text-sm sm:text-base"
            >
              <option value="">All Brands</option>
              {filteredBrands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Battery Type - only for AH (battery) types */}
        {capacityUnit === "AH" && (
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              Battery Type
            </h3>
            <div className="relative">
              <select
                value={selectedFilters.batteryType || ""}
                onChange={(e) =>
                  handleFilterChange("batteryType", e.target.value)
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 appearance-none font-medium text-gray-900 text-sm sm:text-base"
              >
                <option value="">All Types</option>
                {batteryTypeOptions.map((opt) => (
                  <option key={opt.value || opt} value={opt.value || opt}>
                    {opt.label || opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Capacity - with dynamic options based on product line */}
        {shouldShowCapacity && (
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Capacity ({capacityUnit === "VA" ? "VA/kVA" : "AH"})
            </h3>
            <div className="relative">
              <select
                value={selectedFilters.capacity || selectedFilters.capacityRange || capacityOptions[0]?.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // Update both capacity and capacityRange for compatibility
                  setSelectedFilters((prev) => ({
                    ...prev,
                    capacity: value,
                    capacityRange: value,
                  }));
                }}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 appearance-none font-medium text-gray-900 text-sm sm:text-base"
              >
                {capacityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            {activeFiltersCount > 0
              ? `${activeFiltersCount} filter${
                  activeFiltersCount > 1 ? "s" : ""
                } applied`
              : "No filters applied"}
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
          background: #3b82f6;
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
          background: #3b82f6;
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
