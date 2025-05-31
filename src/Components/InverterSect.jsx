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
    <div ref={sectionRef} className='container mx-auto px-4 py-16 bg-gray-50'>
      {/* Car Inverters Section */}
      <section className='mb-16'>
        <h1 ref={carTitleRef} className='text-2xl md:text-3xl font-bold mb-8 text-center md:text-left text-[#008246] relative'>
          Best Selling Car Inverters
          <span className="absolute -bottom-2 left-0 w-20 h-1 bg-[#E4C73F] hidden md:block"></span>
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {carInverters.map((inverter, index) => (
            <div 
              key={index} 
              ref={addToCarRefs}
              className='bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group'
            >
              <div className='aspect-w-16 aspect-h-9 overflow-hidden'>
                <img 
                  src={inverter.img} 
                  alt={inverter.name}
                  className='w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500'
                />
              </div>
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-gray-800 text-center'>{inverter.name}</h3>
                <p className='text-center text-[#008246] font-bold mt-2'>{inverter.price}</p>
                <button className='w-full mt-4 py-2 bg-[#E4C73F] text-black font-semibold rounded hover:bg-[#d4b82f] transition-colors'>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Home Inverters Section */}
      <section>
        <h1 ref={homeTitleRef} className='text-2xl md:text-3xl font-bold mb-8 text-center md:text-left text-[#008246] relative'>
          Best Selling Home Inverters
          <span className="absolute -bottom-2 left-0 w-20 h-1 bg-[#E4C73F] hidden md:block"></span>
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
          {homeInverters.map((inverter, index) => (
            <div 
              key={index} 
              ref={addToHomeRefs}
              className='bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group'
            >
              <div className='aspect-w-16 aspect-h-9 overflow-hidden'>
                <img 
                  src={inverter.img} 
                  alt={inverter.name}
                  className='w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500'
                />
              </div>
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-gray-800 text-center'>{inverter.name}</h3>
                <p className='text-center text-[#008246] font-bold mt-2'>{inverter.price}</p>
                <button className='w-full mt-4 py-2 bg-[#E4C73F] text-black font-semibold rounded hover:bg-[#d4b82f] transition-colors'>
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