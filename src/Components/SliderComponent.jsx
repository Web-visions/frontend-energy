import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Zap, Battery, Sun, Shield } from 'lucide-react';
import { gsap } from 'gsap';
import { slide1, slide2, slide3 } from '../assets';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import { BATTERY_CAPACITY_OPTIONS } from '../constants/capacity';

const BUDGET_MAX = 100000;

const toMinMaxFromCapacity = (cap) => {
  if (!cap) return { minAH: null, maxAH: null };
  if (cap === '200+') return { minAH: '200', maxAH: null };
  const [min, max] = cap.split('-');
  return { minAH: min || null, maxAH: max || null };
};

const SliderComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // filters
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedBatteryType, setSelectedBatteryType] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [budgetRange, setBudgetRange] = useState([0, 50000]); // [min, max]

  const sliderRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    { id: 1, image: slide1, title: "Premium Battery Solutions", subtitle: "Reliable Power for Every Need", description: "High-performance batteries for automotive, industrial, and home applications with extended warranty coverage." },
    { id: 2, image: slide2, title: "Inverter & UPS Systems", subtitle: "Uninterrupted Power Supply", description: "Advanced power backup solutions for homes and offices with efficient energy management." },
    { id: 3, image: slide3, title: "Solar Power Solutions", subtitle: "Clean Energy for Tomorrow", description: "Complete solar systems with panels, inverters, and batteries for sustainable power generation." },
  ];

  const productTypes = [
    { id: 'battery', name: 'Battery', icon: Battery },
    { id: 'inverter', name: 'Inverter', icon: Zap },
    { id: 'ups', name: 'UPS', icon: Shield },
    { id: 'solar-pcu', name: 'Solar', icon: Sun },
  ];

  const batterySubcategories = [
    { value: 'truck_battery', label: 'Truck Battery' },
    { value: '2_wheeler_battery', label: '2 Wheeler Battery' },
    { value: 'solar_battery', label: 'Solar Battery' },
    { value: 'genset_battery', label: 'Genset Battery' },
    { value: 'four_wheeler_battery', label: 'Four Wheeler Battery' }
  ];

  const categoryBrandMap = {
    battery: ['Exide', 'Luminous', 'Bi Cell', 'SF Batteries', 'Amaron', 'Dynex', 'Livfast'],
    inverter: ['Su-vastika', 'Luminous', 'Microtek'],
    ups: ['APC', 'Su-vastika', 'Luminous', 'Microtek'],
    'solar-pcu': ['Usha Shriram', 'Warree', 'Vikram', 'Adani'],
  };

  const batteryTypeMap = {
    exide: ["lead acid", "li-ion", "smf"],
    luminous: ["lead acid"],
    "bi cell": ["lead acid"],
    "sf batteries": ["lead acid"],
    amaron: ["lead acid", "smf"],
    livfast: ["lead acid"],
    dynex: ["lead acid", "smf"],
  };

  const getFilteredBrands = () => {
    if (!selectedProductType) return [];
    const allowedBrandNames = categoryBrandMap[selectedProductType] || [];
    return brands.filter(brand => allowedBrandNames.includes(brand.name.trim()));
  };

  const getFilteredBatteryTypes = () => {
    if (selectedProductType !== 'battery' || !selectedBrand) return [];
    const selectedBrandObj = brands.find(b => b._id === selectedBrand);
    if (!selectedBrandObj) return [];
    const selectedBrandName = selectedBrandObj.name.trim().toLowerCase();
    const allowedBatteryTypes = batteryTypeMap[selectedBrandName] || [];
    return allowedBatteryTypes.map(bt => ({
      value: bt,
      label: bt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }));
  };

  useEffect(() => {
    productService.getFilterOptions().then((opts) => {
      setBrands(opts.brands || []);
      setCategories(opts.categories || []);
    });
  }, []);

  // Hierarchy resets
  useEffect(() => {
    setSelectedBrand('');
    setSelectedBatteryType('');
    setSelectedSubcategory('');
    setSelectedCapacity('');
  }, [selectedProductType]);

  useEffect(() => {
    setSelectedBatteryType('');
    setSelectedSubcategory('');
    setSelectedCapacity('');
  }, [selectedBrand]);

  useEffect(() => {
    setSelectedSubcategory('');
    setSelectedCapacity('');
  }, [selectedBatteryType]);

  useEffect(() => {
    setSelectedCapacity('');
  }, [selectedSubcategory]);

  // Auto-slide
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    gsap.fromTo(sliderRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
    gsap.fromTo(formRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  // NaN-safe budget slider
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    const safe = Number.isFinite(value) ? value : 0;
    setBudgetRange([0, Math.min(Math.max(safe, 0), BUDGET_MAX)]);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedProductType) params.append('type', selectedProductType);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (selectedBatteryType) params.append('batteryType', selectedBatteryType);
    if (selectedSubcategory) params.append('subcategory', selectedSubcategory);

    // ✅ Capacity goes to URL as BOTH capacityRange and minAH/maxAH
    if (selectedCapacity) {
      const { minAH, maxAH } = toMinMaxFromCapacity(selectedCapacity);
      params.append('capacityRange', selectedCapacity); // for sidebar/UI sync
      if (minAH) params.append('minAH', minAH);         // for API
      if (maxAH) params.append('maxAH', maxAH);         // for API (may be null for 200+)
    }

    params.append('minPrice', String(budgetRange[0]));
    params.append('maxPrice', String(budgetRange[1]));

    // Optionally start at page 1 on new search
    params.append('page', '1');

    navigate(`/products?${params.toString()}`);
  };

  const resetFilters = () => {
    setSelectedProductType('');
    setSelectedBrand('');
    setSelectedBatteryType('');
    setSelectedSubcategory('');
    setSelectedCapacity('');
    setBudgetRange([0, 50000]);
  };

  // percentage for custom track (kept safe)
  const percent = Math.round(((budgetRange?.[1] ?? 0) / BUDGET_MAX) * 100);

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">

          {/* Slider */}
          <div ref={sliderRef} className="w-full lg:w-2/3">
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="relative h-full">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h2 className="text-3xl md:text-4xl font-bold mb-3">{slide.title}</h2>
                      <p className="text-lg md:text-xl mb-2 text-gray-200">{slide.subtitle}</p>
                      <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">{slide.description}</p>
                      <div className="flex gap-3">
                        <button onClick={() => navigate('/products')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium transition-colors duration-300">Shop Now</button>
                        <button onClick={() => navigate('/about')} className="border border-white text-white hover:bg-white hover:text-gray-900 px-6 py-2 rounded font-medium transition-colors duration-300">Learn More</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300">
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Finder */}
          <div ref={formRef} className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg h-[500px] flex flex-col">
              <div className="bg-green-600 p-5 text-white rounded-t-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Filter size={20} />
                  <h3 className="text-xl font-bold">Product Finder</h3>
                </div>
                <p className="text-green-100 text-sm">Find the perfect power solution</p>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-4">

                {/* Step 1 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Step 1: Product Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {productTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedProductType(type.id)}
                          className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300 ${selectedProductType === type.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'
                            }`}
                        >
                          <IconComponent size={20} className={selectedProductType === type.id ? 'text-green-600' : 'text-gray-400'} />
                          <span className={`mt-1 text-xs font-medium ${selectedProductType === type.id ? 'text-green-600' : 'text-gray-600'}`}>
                            {type.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2 - Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Step 2: Choose Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                  >
                    <option value="">
                      {!selectedProductType ? 'Select Product Type First' : 'Select Brand'}
                    </option>
                    {selectedProductType &&
                      getFilteredBrands().map((brand) => (
                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Step 3 - Battery Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Step 3: Battery Type {selectedProductType !== 'battery' && '(Battery Only)'}
                  </label>
                  <select
                    value={selectedBatteryType}
                    onChange={(e) => setSelectedBatteryType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                  >
                    <option value="">
                      {selectedProductType !== 'battery'
                        ? 'Only Available for Batteries'
                        : !selectedBrand
                          ? 'Select Brand First'
                          : 'Select Battery Type'}
                    </option>
                    {selectedProductType === 'battery' && selectedBrand &&
                      getFilteredBatteryTypes().map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Step 4 - Battery Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Step 4: Battery Category {selectedProductType !== 'battery' && '(Battery Only)'}
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                  >
                    <option value="">
                      {selectedProductType !== 'battery'
                        ? 'Only Available for Batteries'
                        : !selectedBrand
                          ? 'Select Brand First'
                          : !selectedBatteryType
                            ? 'Select Battery Type First'
                            : 'Select Category'}
                    </option>
                    {selectedProductType === 'battery' && selectedBrand && selectedBatteryType &&
                      batterySubcategories.map((sub) => (
                        <option key={sub.value} value={sub.value}>{sub.label}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Step 5 - Capacity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Step 5: Capacity (AH) {selectedProductType !== 'battery' && '(Battery Only)'}
                  </label>
                  <select
                    value={selectedCapacity}
                    onChange={(e) => setSelectedCapacity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                  >
                    <option value="">
                      {selectedProductType !== 'battery'
                        ? 'Only Available for Batteries'
                        : !selectedBrand
                          ? 'Select Brand First'
                          : !selectedBatteryType
                            ? 'Select Battery Type First'
                            : !selectedSubcategory
                              ? 'Select Category First'
                              : 'Select Capacity'}
                    </option>
                    {selectedProductType === 'battery' && selectedBrand && selectedBatteryType && selectedSubcategory &&
                      BATTERY_CAPACITY_OPTIONS.map(cap => (
                        <option key={cap.value} value={cap.value}>{cap.label}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Budget slider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget: ₹{Number(budgetRange?.[1] ?? 0).toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={BUDGET_MAX}
                    step="1000"
                    value={budgetRange?.[1] ?? 0}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                    style={{ '--percentage': `${isFinite(percent) ? percent : 0}%` }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹0</span>
                    <span>₹{BUDGET_MAX.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 rounded-b-lg">
                <div className="flex gap-3">
                  <button onClick={resetFilters} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-100 transition-colors duration-300">
                    Reset
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={!selectedProductType}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search size={16} />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-green::-webkit-slider-track {
          background: linear-gradient(
            to right,
            #16a34a 0%,
            #16a34a var(--percentage, 0%),
            #e5e7eb var(--percentage, 0%),
            #e5e7eb 100%
          );
        }
      `}</style>
    </div>
  );
};

export default SliderComponent;
