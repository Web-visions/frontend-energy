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
    // Create animation for the section
    gsap.fromTo(
      textRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Create animation for the image
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div ref={sectionRef} className="flex justify-center py-20 bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]">
    <div className="w-full max-w-7xl flex flex-col md:flex-row items-center gap-14 px-6 md:px-14">
      {/* Image Section */}
      <div
        ref={imageRef}
        className="w-full md:w-1/3 h-[260px] md:h-[340px] rounded-xl shadow-2xl overflow-hidden border-4 border-[#e4c73f33] relative"
        style={{
          backgroundImage: `url(${about})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
      >
        <span className="absolute top-3 right-3 bg-[#008246]/80 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
          New Arrival
        </span>
      </div>
  
      {/* Text Content Section */}
      <div ref={textRef} className="w-full md:w-2/3">
        {/* Premium Tagline */}
        <div className="text-[#E4C73F] font-semibold tracking-widest mb-2 uppercase text-xs md:text-sm">
          India’s Trusted Battery Store
        </div>
  
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-black text-[#008246] mb-3 leading-tight">
          Powering Progress.  
          <span className="block text-gray-900">Reliable Inverter Batteries, Delivered.</span>
        </h1>
        
        {/* Subheading */}
        <div className="text-base md:text-lg text-gray-700 mb-6 max-w-2xl">
          Future-ready energy, backed by expert guidance and transparent pricing—discover the batteries trusted by thousands across India.
        </div>
  
        {/* Feature Icons Row */}
        <div className="flex flex-wrap gap-4 mb-7">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#e4c73f22] rounded-lg shadow-sm text-sm font-medium">
            <span role="img" aria-label="warranty">🔋</span>
            100% Genuine Brands
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#e4c73f22] rounded-lg shadow-sm text-sm font-medium">
            <span role="img" aria-label="delivery">🚚</span>
            Fast Nationwide Delivery
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#e4c73f22] rounded-lg shadow-sm text-sm font-medium">
            <span role="img" aria-label="support">🤝</span>
            Honest Advice, Always
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#e4c73f22] rounded-lg shadow-sm text-sm font-medium">
            <span role="img" aria-label="transparent">🧾</span>
            No Hidden Charges
          </div>
        </div>
  
        {/* Story/Description */}
        <p className="text-gray-600 leading-relaxed mb-7">
          At Energy Store System, we’re not just about selling batteries—we’re about energizing your journey.  
          <br />
          <span className="inline-block mt-2">
            Enjoy hassle-free buying, verified quality direct from authorized partners, and support for every kind of need—from home backup to industrial scale. Our promise: what you see is exactly what you get, every time.
          </span>
        </p>
  
        {/* CTA Button */}
        <button className="mt-2 px-8 py-3 bg-gradient-to-r from-[#E4C73F] to-[#ffe477] text-black font-bold rounded-lg shadow-lg hover:bg-[#d4b82f] hover:scale-105 transition-all text-base">
          Explore Our Batteries
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default Batteries;