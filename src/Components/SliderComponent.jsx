import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { slider_1, slider_2, slider_3, slider_4 } from '../assets';
import { useNavigate } from 'react-router-dom';

const SliderComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    { id: 1, image: slider_4, title: "Premium Battery Solutions", subtitle: "Reliable Power for Every Need", description: "High-performance batteries for automotive, industrial, and home applications with extended warranty coverage." },
    { id: 2, image: slider_2, title: "Inverter & UPS Systems", subtitle: "Uninterrupted Power Supply", description: "Advanced power backup solutions for homes and offices with efficient energy management." },
    { id: 3, image: slider_1, title: "Solar Power Solutions", subtitle: "Clean Energy for Tomorrow", description: "Complete solar systems with panels, inverters, and batteries for sustainable power generation." },
    { id: 4, image: slider_3, title: "Smart Energy Management", subtitle: "Efficiency Meets Innovation", description: "Intelligent energy monitoring and management solutions to optimize usage, reduce costs, and ensure sustainable power consumption." },
  ];

  // Auto-slide
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    gsap.fromTo(sliderRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div ref={sliderRef} className="w-full max-w-7xl mx-auto">
          <div className="relative h-[70vh] min-h-[500px] rounded-lg overflow-hidden shadow-lg bg-white">
            <div className="relative h-full">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover brightness-[0.9]" />
                  <div className="absolute inset-0 bg-black bg-opacity-40" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl md:text-2xl mb-3 text-gray-200">{slide.subtitle}</p>
                    <p className="text-base md:text-lg text-gray-300 mb-8 max-w-3xl">{slide.description}</p>
                    <div className="flex gap-4">
                      <button onClick={() => navigate('/products')} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 text-lg">Shop Now</button>
                      <button onClick={() => navigate('/about')} className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors duration-300 text-lg">Learn More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300">
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;
