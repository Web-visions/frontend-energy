import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cb1, cb2, cb3, cb4, ib1, ib2, ib3 } from '../assets';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const InverterSect = () => {
  const sectionRef = useRef(null);
  const carTitleRef = useRef(null);
  const homeTitleRef = useRef(null);
  const carInvertersRef = useRef([]);
  const homeInvertersRef = useRef([]);

  const carInverters = [
    { img: ib1, name: 'Luminous Red Charge RC 18000ST', price: '₹12,499' },
    { img: ib2, name: 'Luminous Ultra Charge UCTT 18066', price: '₹14,999' },
    { img: ib3, name: 'Amaron AAM-CR-AR150TT54', price: '₹13,299' },
  ];

  const homeInverters = [
    { img: cb1, name: 'Luminous ECO Volt Neo 1050', price: '₹8,999' },
    { img: cb2, name: 'Amaron HB1550A UPS', price: '₹9,499' },
    { img: cb3, name: 'Exide Inverterz GQP 850', price: '₹7,999' },
    { img: cb4, name: 'Su-kam Falcon 900', price: '₹8,499' },
  ];

  useEffect(() => {
    // Animate car inverters section
    gsap.fromTo(
      carTitleRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: carTitleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate car inverter cards with stagger
    gsap.fromTo(
      carInvertersRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        scrollTrigger: {
          trigger: carTitleRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate home inverters section
    gsap.fromTo(
      homeTitleRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: homeTitleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate home inverter cards with stagger
    gsap.fromTo(
      homeInvertersRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        scrollTrigger: {
          trigger: homeTitleRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  // Functions to add elements to the ref arrays
  const addToCarRefs = (el) => {
    if (el && !carInvertersRef.current.includes(el)) {
      carInvertersRef.current.push(el);
    }
  };

  const addToHomeRefs = (el) => {
    if (el && !homeInvertersRef.current.includes(el)) {
      homeInvertersRef.current.push(el);
    }
  };

  return (
    <div ref={sectionRef} className="container mx-auto px-4 py-20 bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]">
  {/* Car Inverters Section */}
  <section className="mb-20">
    <h1
      ref={carTitleRef}
      className="text-3xl md:text-4xl font-black mb-10 text-center md:text-left text-[#008246] relative"
    >
      Best Selling Car Inverters
      <span className="absolute left-1/2 md:left-0 -bottom-2 w-28 h-1 bg-[#E4C73F] rounded-full -translate-x-1/2 md:translate-x-0 transition-all duration-300"></span>
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {carInverters.map((inverter, index) => (
        <div
          key={index}
          ref={el => (carInvertersRef.current[index] = el)}
          className="relative bg-white rounded-2xl shadow-md group hover:shadow-2xl overflow-hidden transition-all duration-300"
        >
          {/* Ribbon */}
          <span className="absolute top-3 left-3 bg-[#008246]/90 text-white text-xs font-bold px-3 py-1 rounded shadow-md z-10 uppercase tracking-wider">
            Best Seller
          </span>
          {/* Image */}
          <div className="relative h-56 md:h-64 w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#e4c73f1a] to-[#00824611]">
            <img
              src={inverter.img}
              alt={inverter.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              draggable="false"
            />
          </div>
          {/* Info */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">{inverter.name}</h3>
            <p className="text-center text-[#008246] font-bold text-lg mb-4">{inverter.price}</p>
            <div className="flex items-center gap-2 justify-center mb-3">
              <button className="inline-block px-2 py-1 text-xs bg-[#e4c73f22] text-[#008246] rounded-md font-semibold hover:bg-[#E4C73F]/50 transition-colors duration-150">
                Compare
              </button>
              <button className="inline-block px-2 py-1 text-xs bg-[#e4c73f22] text-[#008246] rounded-md font-semibold hover:bg-[#E4C73F]/50 transition-colors duration-150">
                Wishlist
              </button>
            </div>
            <button className="w-full mt-1 py-2 bg-gradient-to-r from-[#E4C73F] to-[#ffe477] text-black font-bold rounded-lg shadow hover:bg-[#d4b82f] hover:scale-[1.02] transition-all">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* Home Inverters Section */}
  <section>
    <h1
      ref={homeTitleRef}
      className="text-3xl md:text-4xl font-black mb-10 text-center md:text-left text-[#008246] relative"
    >
      Best Selling Home Inverters
      <span className="absolute left-1/2 md:left-0 -bottom-2 w-28 h-1 bg-[#E4C73F] rounded-full -translate-x-1/2 md:translate-x-0 transition-all duration-300"></span>
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {homeInverters.map((inverter, index) => (
        <div
          key={index}
          ref={el => (homeInvertersRef.current[index] = el)}
          className="relative bg-white rounded-2xl shadow-md group hover:shadow-2xl overflow-hidden transition-all duration-300"
        >
          {/* Ribbon */}
          <span className="absolute top-3 left-3 bg-[#E4C73F]/90 text-[#008246] text-xs font-bold px-3 py-1 rounded shadow-md z-10 uppercase tracking-wider">
            Popular
          </span>
          {/* Image */}
          <div className="relative h-44 md:h-56 w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#e4c73f1a] to-[#00824611]">
            <img
              src={inverter.img}
              alt={inverter.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              draggable="false"
            />
          </div>
          {/* Info */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">{inverter.name}</h3>
            <p className="text-center text-[#008246] font-bold text-lg mb-4">{inverter.price}</p>
            <div className="flex items-center gap-2 justify-center mb-3">
              <button className="inline-block px-2 py-1 text-xs bg-[#e4c73f22] text-[#008246] rounded-md font-semibold hover:bg-[#E4C73F]/50 transition-colors duration-150">
                Compare
              </button>
              <button className="inline-block px-2 py-1 text-xs bg-[#e4c73f22] text-[#008246] rounded-md font-semibold hover:bg-[#E4C73F]/50 transition-colors duration-150">
                Wishlist
              </button>
            </div>
            <button className="w-full mt-1 py-2 bg-gradient-to-r from-[#E4C73F] to-[#ffe477] text-black font-bold rounded-lg shadow hover:bg-[#d4b82f] hover:scale-[1.02] transition-all">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
</div>

  );
};

export default InverterSect;