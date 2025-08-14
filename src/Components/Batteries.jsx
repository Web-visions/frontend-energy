import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../assets';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Batteries = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Simplified animations
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <div ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          
          {/* Image Section */}
          <div ref={imageRef} className="w-full lg:w-1/2">
            <div className="relative">
              <img 
                src={about} 
                alt="Battery Products" 
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-4 right-4 bg-green-600 text-white text-sm font-medium px-3 py-1 rounded">
                Trusted Quality
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div ref={textRef} className="w-full lg:w-1/2">
            
            {/* Badge */}
            <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded mb-4">
              India's Trusted Battery Store
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Reliable Power Solutions
              <span className="block text-green-600">For Every Need</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Quality batteries and power solutions backed by expert guidance and transparent pricing. 
              Trusted by thousands across India for home, automotive, and industrial applications.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700 font-medium">100% Genuine Products</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700 font-medium">Fast Delivery</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700 font-medium">Expert Support</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700 font-medium">Best Prices</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Why Choose Energy Store System?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We're committed to providing genuine, high-quality batteries from authorized dealers. 
                Our transparent pricing and honest advice ensure you get the right power solution for your specific needs.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/products?type=battery" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300 text-center"
              >
                Browse Batteries
              </a>
              <a 
                href="/contact" 
                className="inline-block border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300 text-center"
              >
                Get Expert Advice
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batteries;
