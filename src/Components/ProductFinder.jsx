// src/components/ProductFinder.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate, createSearchParams } from "react-router-dom";
import { getData } from "../utils/http";

/* -------------------- constants & helpers -------------------- */

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
  "Genset Batteries": ["Exide", "Bi Cell","Amron"],
  "Inverter & Battery Combo": ["Amaron", "Exide", "Luminous", "Microtek", "Bi Cell"],
  "Inverter & UPS System": ["Exide", "Luminous", "Microtek"],
  "Inverter Batteries": ["Amaron","Exide","Livfast","Luminous","Microtek","SF Batteries","Bi Cell","Okaya","Amaze"],
  "SMF/VRLA Batteries": ["Amaron","Exide"],
  "Solar Batteries": ["Exide","Luminous","Bi Cell"],
  "Solar Energy Solutions": ["Luminous","Microtek"],
  "Solar Inverters": ["Luminous","Microtek","Su-vastika"],
  "Online UPS": ["Microtek","APC","Su-vastika","Luminous"],
  Inverter: ["Su-vastika", "Livguard", "Luminous", "Microtek"],
};

const CAPACITY_OPTIONS_AH = [
  { value: "0-50", label: "0 - 50 AH" },
  { value: "51-100", label: "51 - 100 AH" },
  { value: "101-150", label: "101 - 150 AH" },
  { value: "151-200", label: "151 - 200 AH" },
  { value: "200+", label: "200+ AH" },
];

const CAPACITY_OPTIONS_VA = [
  { value: "0-1000", label: "≤ 1 kVA (≤ 1000 VA)" },
  { value: "1001-2000", label: "1–2 kVA" },
  { value: "2001-3000", label: "2–3 kVA" },
  { value: "3001-5000", label: "3–5 kVA" },
  { value: "5000+", label: "> 5 kVA" },
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

const normalize = (v) => (v || "").toString().trim().toLowerCase();
const getCanonicalBrandName = (brandName) => {
  const key = normalize(brandName);
  return BRAND_ALIAS_MAP[key] || brandName;
};
const getAllowedBrandNamesForProductLine = (productLineName) => {
  const allowed = PRODUCT_LINE_TO_BRANDS[productLineName] || [];
  return allowed.map(getCanonicalBrandName);
};

/* -------------------- component -------------------- */

const ProductFinder = ({ compact = false }) => {
  // data pools
  const [productLines, setProductLines] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  // selections
  const [selectedProductLineId, setSelectedProductLineId] = useState("");
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("");
  const [selectedVehicleModelId, setSelectedVehicleModelId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const formRef = useRef(null);
  const navigate = useNavigate();

  /* derived flags */
  const selectedProductLineName = useMemo(
    () => productLines.find((p) => p._id === selectedProductLineId)?.name || "",
    [selectedProductLineId, productLines]
  );

  // vehicle product-line detection (only these three show Manufacturer+Model UI)
  const isVehicleProductLine = useMemo(() => {
    if (!selectedProductLineName) return false;
    return ["2 Wheeler Batteries", "Four Wheeler Batteries", "Truck Batteries"].includes(
      selectedProductLineName
    );
  }, [selectedProductLineName]);

  // show capacity only when a product line is chosen AND it is NOT a vehicle product line
  const showCapacity = useMemo(() => {
    return Boolean(selectedProductLineName) && !isVehicleProductLine;
  }, [selectedProductLineName, isVehicleProductLine]);

  const getCategoryFromProductLine = (name) => {
    if (!name) return null;
    if (name.includes("2 Wheeler")) return "2-wheeler";
    if (name.includes("Four Wheeler")) return "4-wheeler";
    if (name.includes("Truck")) return "truck";
    return null;
  };

  /* data loading */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [productLineResp, brandResp] = await Promise.all([
          getCachedData("/product-lines"),
          getCachedData("/brands?limit=1000&page=1"),
        ]);
        if (!mounted) return;
        setProductLines(productLineResp.productLines || []);
        setBrands(brandResp.data || []);
      } catch (err) {
        if (!mounted) return;
        setProductLines([]);
        setBrands([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // reset downstream selections when product line changes
    setSelectedManufacturerId("");
    setSelectedVehicleModelId("");
    setVehicleModels([]);
    setManufacturers([]);

    if (!selectedProductLineId) return;

    let mounted = true;
    (async () => {
      try {
        const resp = await getCachedData("/manufacturers");
        if (!mounted) return;
        const productLineName = productLines.find((pl) => pl._id === selectedProductLineId)?.name || "";
        const category = getCategoryFromProductLine(productLineName);
        let list = resp.manufacturers || [];
        if (category) list = list.filter((m) => m.category === category);
        setManufacturers(list);
      } catch (err) {
        if (!mounted) return;
        setManufacturers([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedProductLineId, productLines]);

  useEffect(() => {
    setSelectedVehicleModelId("");
    setVehicleModels([]);
    if (!selectedManufacturerId) return;

    let mounted = true;
    (async () => {
      try {
        const resp = await getCachedData(`/vehicle-models?manufacturer=${selectedManufacturerId}`);
        if (!mounted) return;
        setVehicleModels(resp.vehicleModels || []);
      } catch (err) {
        if (!mounted) return;
        setVehicleModels([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedManufacturerId]);

  useEffect(() => {
    setSelectedBrandId("");
    if (!selectedProductLineName) {
      setFilteredBrands([]);
      return;
    }
    const allowed = new Set(getAllowedBrandNamesForProductLine(selectedProductLineName).map(normalize));
    const matching = (brands || []).filter((b) => allowed.has(normalize(getCanonicalBrandName(b.name))));
    setFilteredBrands(matching);
  }, [selectedProductLineName, brands]);

  useEffect(() => {
    setSelectedCity("");
  }, [selectedState]);

  useEffect(() => {
    if (compact) return;
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
    }
  }, [compact]);

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
    if (!selectedProductLineName) return "AH"; // default before selection
    const lowerName = selectedProductLineName.toLowerCase();
    if (EXPLICIT_VA_PRODUCT_LINES.has(selectedProductLineName)) return "VA";
    if (lowerName.includes("ups")) return "VA"; // catch 'Online UPS', 'Computer UPS', etc.
    return "AH";
  }, [selectedProductLineName, EXPLICIT_VA_PRODUCT_LINES]);

  /* handlers */
  const handleSearch = () => {
    const query = {};
    if (selectedProductLineId) query.productLine = selectedProductLineId;
    if (selectedManufacturerId) query.manufacturer = selectedManufacturerId;
    if (selectedVehicleModelId) query.vehicleModel = selectedVehicleModelId;
    if (selectedBrandId) query.brand = selectedBrandId;
    if (showCapacity && selectedCapacity) query.capacityRange = selectedCapacity;
    if (selectedState) query.state = selectedState;
    if (selectedCity) query.city = selectedCity;
    query.page = "1";
    navigate({ pathname: "/products", search: "?" + createSearchParams(query).toString() });
  };
  

  const resetAll = () => {
    setSelectedProductLineId("");
    setSelectedManufacturerId("");
    setSelectedVehicleModelId("");
    setSelectedBrandId("");
    setSelectedCapacity("");
    setSelectedState("");
    setSelectedCity("");
  };

    // enable search only when a product line is selected AND at least 2 other filters are selected
  const isSearchEnabled = useMemo(() => {
    if (!selectedProductLineId) return false;
    // list the other fields that count toward the "at least 3" goal
    const otherFields = [
      selectedManufacturerId,
      selectedVehicleModelId,
      selectedBrandId,
      selectedCapacity,
      selectedState,
      selectedCity,
    ];
    // count non-empty others
    const selectedOthers = otherFields.filter((v) => v && v !== "").length;
    // require at least 2 other selections (so productLine + 2 others = 3)
    return selectedOthers >= 2;
  }, [
    selectedProductLineId,
    selectedManufacturerId,
    selectedVehicleModelId,
    selectedBrandId,
    selectedCapacity,
    selectedState,
    selectedCity,
  ]);

  /* ---------- RENDER ---------- */

  if (compact) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Product Line */}
          <div className="flex-1 min-w-[180px]">
            <select
              value={selectedProductLineId}
              onChange={(e) => setSelectedProductLineId(e.target.value)}
              className="w-full text-sm p-2 border border-gray-300 rounded"
            >
              <option value="">Product Line</option>
              {productLines.map((pl) => (
                <option key={pl._id} value={pl._id}>
                  {pl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Manufacturer & Vehicle Model - ONLY for vehicle product lines */}
          {isVehicleProductLine && (
            <>
              <div className="min-w-[150px]">
                <select
                  value={selectedManufacturerId}
                  onChange={(e) => setSelectedManufacturerId(e.target.value)}
                  disabled={!selectedProductLineId || manufacturers.length === 0}
                  className="text-sm p-2 border border-gray-300 rounded min-w-[150px] disabled:opacity-50"
                >
                  <option value="">
                    {!selectedProductLineId
                      ? "Select product line"
                      : manufacturers.length
                      ? "Manufacturer"
                      : "No manufacturers"}
                  </option>
                  {manufacturers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-[150px]">
                <select
                  value={selectedVehicleModelId}
                  onChange={(e) => setSelectedVehicleModelId(e.target.value)}
                  disabled={!selectedManufacturerId || vehicleModels.length === 0}
                  className="text-sm p-2 border border-gray-300 rounded min-w-[150px] disabled:opacity-50"
                >
                  <option value="">
                    {!selectedProductLineId
                      ? "Select product line"
                      : !selectedManufacturerId
                      ? "Select manufacturer first"
                      : vehicleModels.length
                      ? "Vehicle model"
                      : "No models"}
                  </option>
                  {vehicleModels.map((vm) => (
                    <option key={vm._id} value={vm._id}>
                      {vm.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

         

          {/* Capacity - only when selected product line is non-vehicle */}
          {showCapacity && (
            <div className="min-w-[140px]">
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="text-sm p-2 border border-gray-300 rounded min-w-[140px]"
              >
                <option value="">{capacityUnit === "VA" ? "VA/kVA" : "AH"}</option>
                {(capacityUnit === "VA" ? CAPACITY_OPTIONS_VA : CAPACITY_OPTIONS_AH).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

           {/* Brand */}
          <div className="min-w-[140px]">
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              disabled={filteredBrands.length === 0}
              className="text-sm p-2 border border-gray-300 rounded min-w-[140px] disabled:opacity-50"
            >
              <option value="">{filteredBrands.length ? "Brand" : "Brand"}</option>
              {filteredBrands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="min-w-[130px]">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-sm p-2 border border-gray-300 rounded min-w-[130px]"
            >
              <option value="">State</option>
              <option value="Haryana">Haryana</option>
            </select>
          </div>

          {/* City */}
          <div className="min-w-[130px]">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState || !CITY_OPTIONS_BY_STATE[selectedState]}
              className="text-sm p-2 border border-gray-300 rounded min-w-[130px] disabled:opacity-50"
            >
              <option value="">{selectedState ? "City" : "Select state"}</option>
              {selectedState &&
                (CITY_OPTIONS_BY_STATE[selectedState] || []).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={resetAll}
              className="text-sm px-3 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50"
              aria-label="Reset filters"
            >
              Reset
            </button>
            <button
              onClick={handleSearch}
              // disabled={!selectedProductLineId}
              disabled={!isSearchEnabled}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Find products"
            >
              <Search size={15} />
              Find
            </button>
          </div>
        </div>
      </div>
    );
  }

  // full layout
  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div ref={formRef} className="max-w-full mx-auto">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-green-600 p-6 text-white rounded-t-lg">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">Quick Product Finder</h3>
              </div>
              <p className="text-green-100">Find the perfect power solution for your needs</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Product Line */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Product Line</label>
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

              {/* Manufacturer & Vehicle Model: only render when product line is a vehicle type */}
              {isVehicleProductLine && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Manufacturer</label>
                    <select
                      value={selectedManufacturerId}
                      onChange={(e) => setSelectedManufacturerId(e.target.value)}
                      disabled={!selectedProductLineId || manufacturers.length === 0}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedProductLineId ? "Select product line first" : manufacturers.length ? "Choose a Manufacturer" : "No Manufacturer Available"}
                      </option>
                      {manufacturers.map((manufacturer) => (
                        <option key={manufacturer._id} value={manufacturer._id}>
                          {manufacturer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Vehicle Model</label>
                    <select
                      value={selectedVehicleModelId}
                      onChange={(e) => setSelectedVehicleModelId(e.target.value)}
                      disabled={!selectedManufacturerId || vehicleModels.length === 0}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedProductLineId
                          ? "Select product line first"
                          : !selectedManufacturerId
                          ? "Select manufacturer first"
                          : vehicleModels.length
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
                </>
              )}

              {/* Capacity - only shown when product line selected and it is NOT a vehicle product line */}
              {showCapacity && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Capacity ({capacityUnit === "VA" ? "VA/kVA" : "AH"})</label>
                  <select
                    value={selectedCapacity}
                    onChange={(e) => setSelectedCapacity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="">{`Choose ${capacityUnit === "VA" ? "VA/kVA" : "AH"}`}</option>
                    {(capacityUnit === "VA" ? CAPACITY_OPTIONS_VA : CAPACITY_OPTIONS_AH).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Brand</label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  disabled={filteredBrands.length === 0}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">{selectedProductLineId ? (filteredBrands.length ? "Choose a Brand" : "No Brand Available for this Product Line") : "Select a Product Line first"}</option>
                  {filteredBrands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="">Choose a State</option>
                  <option value="Haryana">Haryana</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">{selectedState ? "Choose a City" : "Select a State first"}</option>
                  {selectedState && (CITY_OPTIONS_BY_STATE[selectedState] || []).map((city) => (
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
                  onClick={resetAll}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
                >
                  Reset
                </button>
                <button
                  onClick={handleSearch}
                  // disabled={!selectedProductLineId}
                  disabled={!isSearchEnabled}
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
