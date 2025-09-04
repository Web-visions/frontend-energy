import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate, createSearchParams } from "react-router-dom";
import { getData } from "../utils/http";

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
  "Four Wheeler Batteries": [
    "Amaron",
    "Dynex",
    "Exide",
    "Livfast",
    "SF Batteries",
  ],
  "Truck Batteries": ["Amaron", "Dynex", "Exide", "Bi Cell"],
  "Genset Batteries": ["Exide","Bi Cell"],
  "Inverter & Battery Combo": ["Amaron", "Exide", "Luminous", "Microtek","Bi Cell"],
  "Inverter & UPS System": ["Exide", "Luminous", "Microtek"],
  "Inverter Batteries": [
    "Amaron",
    "Exide",
    "Livfast",
    "Luminous",
    "Microtek",
    "SF Batteries",
    "Bi Cell"
  ],
  "SMF/VRLA Batteries": ["Amaron", "Exide","Bi Cell"],
  "Solar Batteries": ["Exide", "Luminous","Bi Cell"],
  "Solar Energy Solutions": ["Luminous", "Microtek"],
  "Solar Inverters": ["Luminous", "Microtek"],
  "Computer UPS": ["Microtek", "APC"],
  // "Voltage Stabilizer": ["Microtek"],
    "Inverter": ["Amaron", "Exide", "Luminous", "Microtek"],

};

const CAPACITY_OPTIONS_AH = [
  { value: "0-50", label: "0 - 50 AH" },
  { value: "51-100", label: "51 - 100 AH" },
  { value: "101-150", label: "101 - 150 AH" },
  { value: "151-200", label: "151 - 200 AH" },
  { value: "200+", label: "200+ AH" },
];

const CAPACITY_OPTIONS_VA = [
  { value: "0-1000", label: "0 - 1 kVA (≤1000 VA)" },
  { value: "1001-2000", label: "1 - 2 kVA" },
  { value: "2001-3000", label: "2 - 3 kVA" },
  { value: "3001-5000", label: "3 - 5 kVA" },
  { value: "5000+", label: "5.0+ kVA" },
];

const CITY_OPTIONS_BY_STATE = {
  Haryana: ["Gurugram"],
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const responseCache = new Map();
const inflightCache = new Map();

async function getCachedData(url) {
  const now = Date.now();
  const cachedEntry = responseCache.get(url);
  if (cachedEntry && now - cachedEntry.timestamp < CACHE_TTL_MS) {
    return cachedEntry.data;
  }
  if (inflightCache.has(url)) {
    return inflightCache.get(url);
  }
  const requestPromise = getData(url)
    .then((data) => {
      responseCache.set(url, { data, timestamp: Date.now() });
      inflightCache.delete(url);
      return data;
    })
    .catch((error) => {
      inflightCache.delete(url);
      throw error;
    });
  inflightCache.set(url, requestPromise);
  return requestPromise;
}

const ProductFinder = () => {
  const [productLines, setProductLines] = useState([]);
  const [allManufacturers, setAllManufacturers] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  const [selectedProductLineId, setSelectedProductLineId] = useState("");
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("");
  const [selectedVehicleModelId, setSelectedVehicleModelId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const formRef = useRef(null);
  const navigate = useNavigate();

  const selectedProductLineName = useMemo(() => {
    return (
      productLines.find((pl) => pl._id === selectedProductLineId)?.name || ""
    );
  }, [selectedProductLineId, productLines]);

  const shouldShowManufacturerAndModel = useMemo(() => {
    if (!selectedProductLineName) return false;
    return [
      "2 Wheeler Batteries",
      "Four Wheeler Batteries",
      "Truck Batteries",
    ].includes(selectedProductLineName);
  }, [selectedProductLineName]);

  const shouldShowCapacity = useMemo(() => {
    if (!selectedProductLineName) return false;
    const hiddenFor = [
      "2 Wheeler Batteries",
      "Four Wheeler Batteries",
      "Truck Batteries",
    ];
    return !hiddenFor.includes(selectedProductLineName);
  }, [selectedProductLineName]);

  const getCategoryFromProductLine = (productLineName) => {
    if (productLineName.includes("2 Wheeler")) return "2-wheeler";
    if (productLineName.includes("Four Wheeler")) return "4-wheeler";
    if (productLineName.includes("Truck")) return "truck";
    return null;
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

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [productLineResponse, brandResponse] = await Promise.all([
          getCachedData("/product-lines"),
          getCachedData("/brands?limit=1000&page=1"),
        ]);
        if (!isMounted) return;
        setProductLines(productLineResponse.productLines || []);
        setAllBrands(brandResponse.data || []);
      } catch (error) {
        if (!isMounted) return;
        setProductLines([]);
        setAllBrands([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedManufacturerId("");
    setSelectedVehicleModelId("");
    setVehicleModels([]);

    if (!selectedProductLineId) {
      setAllManufacturers([]);
      return;
    }

    let isMounted = true;
    const productLineName =
      productLines.find((pl) => pl._id === selectedProductLineId)?.name || "";
    const category = productLineName
      ? getCategoryFromProductLine(productLineName)
      : null;

    (async () => {
      try {
        const response = await getCachedData("/manufacturers");
        if (!isMounted) return;
        let list = response.manufacturers || [];
        if (category) {
          list = list.filter((m) => m.category === category);
        }
        setAllManufacturers(list);
      } catch (error) {
        if (!isMounted) return;
        setAllManufacturers([]);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedProductLineId, productLines]);

  useEffect(() => {
    setSelectedVehicleModelId("");
    setVehicleModels([]);

    if (!selectedManufacturerId) return;

    let isMounted = true;
    (async () => {
      try {
        const response = await getCachedData(
          `/vehicle-models?manufacturer=${selectedManufacturerId}`
        );
        if (!isMounted) return;
        setVehicleModels(response.vehicleModels || []);
      } catch (error) {
        if (!isMounted) return;
        setVehicleModels([]);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedManufacturerId]);

  useEffect(() => {
    setSelectedBrandId("");
    if (!selectedProductLineName) {
      setFilteredBrands([]);
      return;
    }
    const allowedBrandNames = new Set(
      getAllowedBrandNamesForProductLine(selectedProductLineName).map(normalize)
    );
    const matchingBrands = (allBrands || []).filter((brand) => {
      const canonicalName = getCanonicalBrandName(brand.name);
      return allowedBrandNames.has(normalize(canonicalName));
    });
    setFilteredBrands(matchingBrands);
  }, [selectedProductLineName, allBrands]);

  useEffect(() => {
    setSelectedCity("");
  }, [selectedState]);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  const handleSearch = () => {
    const query = {};
    if (selectedProductLineId) query.productLine = selectedProductLineId;
    if (shouldShowManufacturerAndModel && selectedManufacturerId)
      query.manufacturer = selectedManufacturerId;
    if (shouldShowManufacturerAndModel && selectedVehicleModelId)
      query.vehicleModel = selectedVehicleModelId;
    if (selectedBrandId) query.brand = selectedBrandId;
    if (shouldShowCapacity && selectedCapacity)
      query.capacityRange = selectedCapacity;
    if (selectedState) query.state = selectedState;
    if (selectedCity) query.city = selectedCity;
    query.page = "1";
    navigate({
      pathname: "/products",
      search: "?" + createSearchParams(query).toString(),
    });
  };

  const resetAllFilters = () => {
    setSelectedProductLineId("");
    setSelectedManufacturerId("");
    setSelectedVehicleModelId("");
    setSelectedBrandId("");
    setSelectedCapacity("");
    setSelectedState("");
    setSelectedCity("");
  };

  const USE_VA_PRODUCT_LINES = new Set([
    "Inverter",
    "Inverter & UPS System",
    "Inverter & Battery Combo",
    "Solar Inverters",
    "Computer UPS",
    "Solar Energy Solutions",
  ]);

  const capacityUnit = useMemo(() => {
    if (!selectedProductLineName) return null;
    return USE_VA_PRODUCT_LINES.has(selectedProductLineName) ? "VA" : "AH";
  }, [selectedProductLineName]);

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div ref={formRef} className="max-w-full mx-auto">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-green-600 p-6 text-white rounded-t-lg">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">Quick Product Finder</h3>
              </div>
              <p className="text-green-100">
                Find the perfect power solution for your needs
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Product Line
                </label>
                <select
                  value={selectedProductLineId}
                  onChange={(e) => setSelectedProductLineId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="">Choose a Product Line</option>
                  {productLines.map((productLine) => (
                    <option key={productLine._id} value={productLine._id}>
                      {productLine.name}
                    </option>
                  ))}
                </select>
              </div>
              {shouldShowManufacturerAndModel && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Manufacturer
                  </label>
                  <select
                    value={selectedManufacturerId}
                    onChange={(e) => setSelectedManufacturerId(e.target.value)}
                    disabled={allManufacturers.length === 0}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="">
                      {allManufacturers.length > 0
                        ? "Choose a Manufacturer"
                        : "No Manufacturer Available"}
                    </option>
                    {allManufacturers.map((manufacturer) => (
                      <option key={manufacturer._id} value={manufacturer._id}>
                        {manufacturer.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {shouldShowManufacturerAndModel && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Vehicle Model
                  </label>
                  <select
                    value={selectedVehicleModelId}
                    onChange={(e) => setSelectedVehicleModelId(e.target.value)}
                    disabled={vehicleModels.length === 0}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="">
                      {vehicleModels.length > 0
                        ? "Choose a Vehicle Model"
                        : "No Model Available"}
                    </option>
                    {vehicleModels.map((vehicleModel) => (
                      <option key={vehicleModel._id} value={vehicleModel._id}>
                        {vehicleModel.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {shouldShowCapacity && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Capacity ({capacityUnit === "VA" ? "VA/kVA" : "AH"})
                  </label>
                  <select
                    value={selectedCapacity}
                    onChange={(e) => setSelectedCapacity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="">{`Choose ${
                      capacityUnit === "VA" ? "VA/kVA" : "AH"
                    }`}</option>
                    {(capacityUnit === "VA"
                      ? CAPACITY_OPTIONS_VA
                      : CAPACITY_OPTIONS_AH
                    ).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Brand
                </label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  disabled={filteredBrands.length === 0}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="">
                    {selectedProductLineId
                      ? filteredBrands.length > 0
                        ? "Choose a Brand"
                        : "No Brand Available for this Product Line"
                      : "Select a Product Line first"}
                  </option>
                  {filteredBrands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="">Choose a State</option>
                  <option value="Haryana">Haryana</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="">
                    {selectedState ? "Choose a City" : "Select a State first"}
                  </option>
                  {selectedState &&
                    (CITY_OPTIONS_BY_STATE[selectedState] || []).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-lg">
              <div className="flex gap-4">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
                >
                  Reset
                </button>
                <button
                  onClick={handleSearch}
                  disabled={!selectedProductLineId}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search size={18} />
                  Find Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFinder;
