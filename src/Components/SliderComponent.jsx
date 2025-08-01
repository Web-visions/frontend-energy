import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { gsap } from 'gsap';
import { slide1, slide2, slide3 } from '../assets';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';

const SliderComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [budget, setBudget] = useState([0, 100000]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const sliderRef = useRef(null);
  const formRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      image: slide1,
      title: "Premium Power Solutions",
      subtitle: "Reliable energy for your home and business",
      description: "Advanced inverters and UPS systems for uninterrupted power supply"
    },
    {
      id: 2,
      image: slide2,
      title: "Advanced Battery Technology",
      subtitle: "Long-lasting power you can depend on",
      description: "High-performance lithium and lead-acid batteries with extended warranty"
    },
    {
      id: 3,
      image: slide3,
      title: "Solar Energy Systems",
      subtitle: "Sustainable power for a greener future",
      description: "Complete solar solutions with panels, inverters, and monitoring systems"
    },
  ];

  const categoryBrandMap = {
    '684c61f2f08ba1dc99d55927': ['Su-vastika', 'Luminous', 'Microtek'],
    '684c621ef08ba1dc99d55933': ['Exide', 'Luminous', 'Bi Cell', 'SF Batteries', 'Amaron', 'Dynex', 'Livfast'],
    '684c61f8f08ba1dc99d5592d': ['APC', 'Su-vastika', 'Luminous', 'Microtek'],
    '684c6222f08ba1dc99d55939': ['Usha Shriram', 'Warree', 'Vikram', 'Adani']
  };
  
  const allowedBrandNames = categoryBrandMap[selectedCategory] || [];
  const filteredBrands = brands.filter(brand =>
    allowedBrandNames.includes(brand.name.trim())
  );
  

  useEffect(() => {
    productService.getFilterOptions().then((opts) => {
      setBrands(opts.brands || []);
      setCategories(opts.categories || []);
    });
  }, []);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
  }, [slides.length]);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const toggleAutoplay = useCallback(() => {
    setIsPlaying(prev => {
      if (!prev) startAutoplay();
      else stopAutoplay();
      return !prev;
    });
  }, [startAutoplay, stopAutoplay]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    stopAutoplay();
    setTimeout(startAutoplay, 3000);
  }, [slides.length, startAutoplay, stopAutoplay]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    stopAutoplay();
    setTimeout(startAutoplay, 3000);
  }, [slides.length, startAutoplay, stopAutoplay]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    stopAutoplay();
    setTimeout(startAutoplay, 3000);
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    gsap.fromTo(
      sliderRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );
    if (isPlaying) startAutoplay();
    return () => stopAutoplay();
  }, [isPlaying, startAutoplay, stopAutoplay]);

  const handleSubmit = () => {
    // Category to product type mapping
    const categoryToTypeMap = {
      'UPS': 'ups',
      'Inverter': 'inverter',
      'Battery': 'battery',
      'Solar PCU': 'solar-pcu',
      'Solar PV Module': 'solar-pv',
      'Solar Street Light': 'solar-street-light'
    };
  
    // Find the selected category object
    const selectedCategoryObj = categories.find(cat => cat._id === selectedCategory);
    let productType = null;
  
    if (selectedCategoryObj) {
      productType = categoryToTypeMap[selectedCategoryObj.name]
        || selectedCategoryObj.name.toLowerCase().replace(/\s+/g, '-');
    }
  
 
    // Build params
    const params = new URLSearchParams();
    if (productType) params.append('type', productType);      // <-- THIS IS THE CRITICAL LINE
    if (selectedCategory && selectedCategory !== '') params.append('category', selectedCategory);
    if (selectedBrand && selectedBrand !== '') params.append('brand', selectedBrand);
    params.append('minPrice', budget[0]);
    params.append('maxPrice', budget[1]);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="relative z-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Slider Section */}
          <div ref={sliderRef} className="w-full lg:w-2/3 relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white">
              {/* Image Container */}
              <div className="relative h-full overflow-hidden">
                <div
                  className="flex h-full transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="min-w-full h-full relative"
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="max-w-2xl">
                          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {slide.title}
                          </h2>
                          <p className="text-xl md:text-2xl mb-3 text-gray-200">
                            {slide.subtitle}
                          </p>
                          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                            {slide.description}
                          </p>

                          <div className="flex items-center gap-4 mt-6">
                            <button
                              className="text-base sm:text-lg bg-gradient-to-r from-[#008246] to-[#009c55] text-white px-5 py-2 sm:px-8 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                              onClick={() => navigate('/about')}
                            >
                              Learn More
                            </button>
                            <button
                              className="text-base sm:text-lg border-2 border-white/30 text-white px-5 py-2 sm:px-8 sm:py-3 rounded-xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                              onClick={() => navigate('/contact')}
                            >
                              Contact Us
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute top-6 right-6 flex items-center gap-3">
                <button
                  onClick={toggleAutoplay}
                  className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="hidden sm:block absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300 group"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={nextSlide}
                className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300 group"
                aria-label="Next slide"
              >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Slide Indicators */}
              <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 ${currentSlide === index
                      ? 'w-8 h-3 bg-white rounded-full'
                      : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-gradient-to-r from-[#008246] to-[#009c55] transition-all duration-1000 ease-linear"
                  style={{
                    width: `${((currentSlide + 1) / slides.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div
            ref={formRef}
            className="w-full lg:w-1/3"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-[500px] flex flex-col">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#008246] to-[#009c55] p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Find Your Perfect Solution</h3>
                <p className="text-green-100">Get personalized recommendations in 3 easy steps</p>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2 mt-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= num
                        ? 'bg-[#E4C73F] text-black'
                        : 'bg-white/20 text-white'
                        }`}>
                        {num}
                      </div>
                      {num < 3 && (
                        <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${step > num ? 'bg-[#E4C73F]' : 'bg-white/20'
                          }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-6 overflow-hidden">
                {step === 1 && (
                  <div className="h-full flex flex-col">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      What are you looking for?
                    </h4>
                    <div className="flex-1 space-y-3 overflow-y-auto">
                      {categories.map(category => (
                        <label
                          key={category._id}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedCategory === category._id
                            ? 'border-[#008246] bg-[#008246]/5 shadow-md'
                            : 'border-gray-200 hover:border-[#008246]/30 hover:bg-gray-50'
                            }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category._id}
                            checked={selectedCategory === category._id}
                            onChange={() => {
                              setSelectedCategory(category._id);
                              setSelectedBrand('');
                            }}
                            className="sr-only"
                          />
                          <span className="font-medium text-gray-700">{category.name}</span>
                          <div className={`ml-auto w-5 h-5 rounded-full border-2 transition-all duration-300 ${selectedCategory === category._id
                            ? 'border-[#008246] bg-[#008246]'
                            : 'border-gray-300'
                            }`}>
                            {selectedCategory === category._id && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={() => selectedCategory && setStep(2)}
                      className="w-full bg-gradient-to-r from-[#008246] to-[#009c55] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                      disabled={!selectedCategory}
                    >
                      Continue
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="h-full flex flex-col">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Select Preferred Brand
                    </h4>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                      {loadingBrands ? (
                        <div className="text-gray-500">Loading brands...</div>
                      ) : brands.length === 0 ? (
                        <div className="text-gray-500">No brands found for this category.</div>
                      ) : filteredBrands.map(brand => (
                        <label
                          key={brand._id}
                          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${selectedBrand === brand._id
                            ? 'border-[#008246] bg-[#008246]/5'
                            : 'border-gray-200 hover:border-[#008246]/30 hover:bg-gray-50'
                            }`}
                        >
                          <input
                            type="radio"
                            name="brand"
                            value={brand._id}
                            checked={selectedBrand === brand._id}
                            onChange={() => setSelectedBrand(brand._id)}
                            className="sr-only"
                          />
                          <span className="font-medium text-gray-700">{brand.name}</span>
                          <div className={`ml-auto w-5 h-5 rounded-full border-2 transition-all duration-300 ${selectedBrand === brand._id
                            ? 'border-[#008246] bg-[#008246]'
                            : 'border-gray-300'
                            }`}>
                            {selectedBrand === brand._id && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 border-2 border-[#008246] text-[#008246] py-3 rounded-xl font-semibold hover:bg-[#008246]/5 transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => selectedBrand && setStep(3)}
                        className="flex-1 bg-gradient-to-r from-[#008246] to-[#009c55] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedBrand}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="h-full flex flex-col">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      What's your budget range?
                    </h4>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="space-y-6">
                        <div className="px-4">
                          <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={budget[1]}
                            onChange={(e) => setBudget([budget[0], parseInt(e.target.value)])}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, #008246 0%, #008246 ${(budget[1] / 100000) * 100}%, #e5e7eb ${(budget[1] / 100000) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex justify-between items-center">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Minimum</p>
                              <p className="text-xl font-bold text-[#008246]">₹{budget[0].toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Maximum</p>
                              <p className="text-xl font-bold text-[#008246]">₹{budget[1].toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 border-2 border-[#008246] text-[#008246] py-3 rounded-xl font-semibold hover:bg-[#008246]/5 transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-[#E4C73F] to-[#d4b82f] text-gray-900 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Find Products
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;