import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { slide1, slide2, slide3 } from '../assets';

const SliderComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [budget, setBudget] = useState([0, 100000]);
  const sliderRef = useRef(null);
  const formRef = useRef(null);

  const slides = [
    { id: 1, image: slide1, title: "Premium Power Solutions", subtitle: "Reliable energy for your home and business" },
    { id: 2, image: slide2, title: "Advanced Battery Technology", subtitle: "Long-lasting power you can depend on" },
    { id: 3, image: slide3, title: "Solar Energy Systems", subtitle: "Sustainable power for a greener future" },
  ];

  const products = [
    'Inverter',
    'UPS',
    'Batteries',
    'Battery water',
    'Solar products',
    'Stabilizers'
  ];

  const companies = {
    'Inverter': ['Su-vastika', 'Luminous', 'Microtek', 'Apc', 'Online ups', 'Exide', 'Bi-Cell', 'Sf', 'Amaron', 'Dynex', 'Livfast'],
    'UPS': ['Online ups', 'Apc', 'Su-vastika', 'Luminous', 'Microtek', 'Exide', 'Bi-Cell', 'Sf', 'Amaron', 'Dynex', 'Livfast'],
    'Batteries': ['Lead acid battery', 'Exide', 'Luminous', 'Bi-Cell', 'Sf', 'Amaron', 'Dynex', 'Livfast'],
    'Solar products': ['Warree', 'Vikram', 'Aadani', 'Exide', 'Luminous', 'Bi-Cell', 'Sf', 'Amaron', 'Dynex', 'Livfast'],
    'Battery water': ['Su-vastika', 'Luminous', 'Exide', 'Bi-Cell', 'Sf', 'Amaron', 'Dynex', 'Livfast'],
    'Stabilizers': ['Su-vastika', 'Microtek', 'Luminous', 'Apc', 'Online ups', 'Exide', 'Bi-Cell', 'Sf', 'Amaron', 'Dynex', 'Livfast']
  };

  useEffect(() => {
    gsap.fromTo(
      sliderRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
    );

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedCompanies([]);
  };

  const handleCompanyToggle = (company) => {
    setSelectedCompanies(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  const handleSubmit = () => {
    alert(`Selected Product: ${selectedProduct}\nSelected Companies: ${selectedCompanies.join(', ')}\nBudget Range: ₹${budget[0]} - ₹${budget[1]}`);
  };

  return (
    <div className="relative z-0 mt-[-1px] bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
          {/* Slider Section */}
          <div ref={sliderRef} className="w-full md:w-3/4 h-[400px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative">
            <div 
              className="flex h-full transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div 
                  key={slide.id} 
                  className="min-w-full h-full relative"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end items-center text-white p-8 text-center">
                    <h2 className="text-4xl font-bold mb-3 transform translate-y-0 transition-transform duration-500">{slide.title}</h2>
                    <p className="text-xl mb-6 transform translate-y-0 transition-transform duration-500 delay-100">{slide.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#008246]"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-[#008246]" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#008246]"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-[#008246]" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div 
            ref={formRef} 
            className="w-full md:w-1/4 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          >
            <div className="p-6 h-[400px] flex flex-col">
              {step === 1 && (
                <div className="space-y-5 flex-1">
                  <h3 className="text-xl font-semibold text-[#008246] border-b border-gray-100 pb-3">
                    What are you looking for?
                  </h3>
                  <div className="space-y-3 flex-1">
                    {products.map(product => (
                      <div 
                        key={product} 
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          id={product}
                          name="product"
                          value={product}
                          checked={selectedProduct === product}
                          onChange={() => handleProductSelect(product)}
                          className="w-4 h-4 text-[#008246] border-gray-300 focus:ring-[#008246]"
                        />
                        <label 
                          htmlFor={product} 
                          className="flex-1 cursor-pointer font-medium text-gray-700 hover:text-[#008246] transition-colors"
                        >
                          {product}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => selectedProduct && setStep(2)}
                    className="w-full bg-gradient-to-r from-[#008246] to-[#009c55] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-transform"
                    disabled={!selectedProduct}
                  >
                    Next
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-[#008246] border-b border-gray-100 pb-3">
                    Select Companies
                  </h3>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {companies[selectedProduct].map(company => (
                      <div 
                        key={company} 
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          id={company}
                          checked={selectedCompanies.includes(company)}
                          onChange={() => handleCompanyToggle(company)}
                          className="w-4 h-4 text-[#008246] rounded border-gray-300 focus:ring-[#008246]"
                        />
                        <label 
                          htmlFor={company} 
                          className="flex-1 cursor-pointer font-medium text-gray-700 hover:text-[#008246] transition-colors"
                        >
                          {company}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => selectedCompanies.length > 0 && setStep(3)}
                      className="w-full bg-gradient-to-r from-[#008246] to-[#009c55] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-transform"
                      disabled={selectedCompanies.length === 0}
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      className="w-full border-2 border-[#008246] text-[#008246] py-2.5 rounded-lg font-semibold hover:bg-[#e8f5ee] transition-colors transform hover:scale-[1.02] transition-transform"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-[#008246] border-b border-gray-100 pb-3">
                    Select Your Budget
                  </h3>
                  <div className="flex-1">
                    <div className="space-y-4 px-2">
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={budget[1]}
                        onChange={(e) => setBudget([budget[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008246]"
                      />
                      <div className="flex justify-between text-sm font-medium text-gray-600">
                        <span>₹{budget[0].toLocaleString()}</span>
                        <span>₹{budget[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-[#E4C73F] to-[#d4b82f] text-gray-900 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity transform hover:scale-[1.02] transition-transform"
                    >
                      Find Products
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="w-full border-2 border-[#008246] text-[#008246] py-2.5 rounded-lg font-semibold hover:bg-[#e8f5ee] transition-colors transform hover:scale-[1.02] transition-transform"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;