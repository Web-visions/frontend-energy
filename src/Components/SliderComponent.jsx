import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Zap, Battery, Sun, Shield } from 'lucide-react';
import { gsap } from 'gsap';
import { slide1, slide2, slide3 } from '../assets';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';

const SliderComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Enhanced filter states
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedBatteryType, setSelectedBatteryType] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [budgetRange, setBudgetRange] = useState([0, 100000]);
  
  const sliderRef = useRef(null);
  const formRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      image: slide1,
      title: "Premium Battery Solutions",
      subtitle: "Reliable Power for Every Need",
      description: "High-performance batteries for automotive, industrial, and home applications with extended warranty coverage."
    },
    {
      id: 2,
      image: slide2,
      title: "Inverter & UPS Systems", 
      subtitle: "Uninterrupted Power Supply",
      description: "Advanced power backup solutions for homes and offices with efficient energy management."
    },
    {
      id: 3,
      image: slide3,
      title: "Solar Power Solutions",
      subtitle: "Clean Energy for Tomorrow",
      description: "Complete solar systems with panels, inverters, and batteries for sustainable power generation."
    },
  ];

  // Product type options
  const productTypes = [
    { id: 'battery', name: 'Battery', icon: Battery },
    { id: 'inverter', name: 'Inverter', icon: Zap },
    { id: 'ups', name: 'UPS', icon: Shield },
    { id: 'solar-pcu', name: 'Solar', icon: Sun },
  ];

  // Battery subcategories
  const batterySubcategories = [
    { value: 'truck_battery', label: 'Truck Battery' },
    { value: '2_wheeler_battery', label: '2 Wheeler Battery' },
    { value: 'solar_battery', label: 'Solar Battery' },
    { value: 'genset_battery', label: 'Genset Battery' },
    { value: 'four_wheeler_battery', label: 'Four Wheeler Battery' }
  ];

  // Battery types
  const batteryTypes = [
    { value: 'li ion', label: 'Li-ion' },
    { value: 'lead acid', label: 'Lead Acid' },
    { value: 'smf', label: 'SMF (Sealed Maintenance Free)' }
  ];

  // Battery capacities (AH)
  const batteryCapacities = [
    { value: '0-50', label: 'Up to 50 AH' },
    { value: '50-100', label: '50 - 100 AH' },
    { value: '100-150', label: '100 - 150 AH' },
    { value: '150-200', label: '150 - 200 AH' },
    { value: '200+', label: '200+ AH' }
  ];

  // FIXED: Category to brand mapping with proper solar brands
  const categoryBrandMap = {
    battery: ['Exide', 'Luminous', 'Bi Cell', 'SF Batteries', 'Amaron', 'Dynex', 'Livfast'],
    inverter: ['Su-vastika', 'Luminous', 'Microtek'],
    ups: ['APC', 'Su-vastika', 'Luminous', 'Microtek'],
    'solar-pcu': ['Usha Shriram', 'Warree', 'Vikram', 'Adani'], // Fixed solar brands
  };

  const getFilteredBrands = () => {
    if (!selectedProductType) return [];
    const allowedBrandNames = categoryBrandMap[selectedProductType] || [];
    return brands.filter(brand => allowedBrandNames.includes(brand.name.trim()));
  };

  useEffect(() => {
    productService.getFilterOptions().then((opts) => {
      setBrands(opts.brands || []);
      setCategories(opts.categories || []);
    });
  }, []);

  // Reset dependent filters when product type changes
  useEffect(() => {
    if (selectedProductType !== 'battery') {
      setSelectedSubcategory('');
      setSelectedBatteryType('');
      setSelectedCapacity('');
    }
    setSelectedBrand('');
  }, [selectedProductType]);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    gsap.fromTo(
      sliderRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedProductType) params.append('type', selectedProductType);
    if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
    if (selectedBatteryType) params.append('batteryType', selectedBatteryType);
    if (selectedBrand) params.append('brand', selectedBrand);
    
    // Handle capacity range
    if (selectedCapacity) {
      const [min, max] = selectedCapacity.split('-');
      if (min && min !== '200+') params.append('minAH', min);
      if (max && max !== '+') params.append('maxAH', max);
      if (selectedCapacity === '200+') params.append('minAH', '200');
    }
    
    params.append('minPrice', budgetRange[0]);
    params.append('maxPrice', budgetRange[1]);
    
    navigate(`/products?${params.toString()}`);
  };

  const resetFilters = () => {
    setSelectedProductType('');
    setSelectedSubcategory('');
    setSelectedBatteryType('');
    setSelectedCapacity('');
    setSelectedBrand('');
    setBudgetRange([0, 100000]);
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          
          {/* SIMPLIFIED SLIDER */}
          <div ref={sliderRef} className="w-full lg:w-2/3">
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg bg-white">
              
              {/* Slide Images */}
              <div className="relative h-full">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      currentSlide === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Simple overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    
                    {/* Content */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl mb-2 text-gray-200">
                        {slide.subtitle}
                      </p>
                      <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
                        {slide.description}
                      </p>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate('/products')}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium transition-colors duration-300"
                        >
                          Shop Now
                        </button>
                        <button
                          onClick={() => navigate('/about')}
                          className="border border-white text-white hover:bg-white hover:text-gray-900 px-6 py-2 rounded font-medium transition-colors duration-300"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simple Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>

              {/* Simple Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Finder - Keep the same enhanced form */}
          <div ref={formRef} className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg h-[500px] flex flex-col">
              
              {/* Header */}
              <div className="bg-green-600 p-5 text-white rounded-t-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Filter size={20} />
                  <h3 className="text-xl font-bold">Product Finder</h3>
                </div>
                <p className="text-green-100 text-sm">Find the perfect power solution</p>
              </div>

              {/* Filter Form */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                
                {/* Product Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {productTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedProductType(type.id)}
                          className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300 ${
                            selectedProductType === type.id
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
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

                {/* Battery-specific filters */}
                {selectedProductType === 'battery' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Battery Category
                      </label>
                      <select
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                      >
                        <option value="">Select Category</option>
                        {batterySubcategories.map((sub) => (
                          <option key={sub.value} value={sub.value}>{sub.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Battery Type
                      </label>
                      <select
                        value={selectedBatteryType}
                        onChange={(e) => setSelectedBatteryType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                      >
                        <option value="">Select Type</option>
                        {batteryTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Capacity (AH)
                      </label>
                      <select
                        value={selectedCapacity}
                        onChange={(e) => setSelectedCapacity(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                      >
                        <option value="">Select Capacity</option>
                        {batteryCapacities.map((capacity) => (
                          <option key={capacity.value} value={capacity.value}>{capacity.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Brand Selection */}
                {selectedProductType && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                    >
                      <option value="">Any Brand</option>
                      {getFilteredBrands().map((brand) => (
                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget: ₹{budgetRange[1].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={budgetRange[1]}
                    onChange={(e) => setBudgetRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹0</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 bg-gray-50 rounded-b-lg">
                <div className="flex gap-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-100 transition-colors duration-300"
                  >
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
          background: linear-gradient(to right, #16a34a 0%, #16a34a var(--percentage), #e5e7eb var(--percentage), #e5e7eb 100%);
        }
      `}</style>
    </div>
  );
};

export default SliderComponent;
