import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { adani, amaron, apc, dynax, excide, livfast, luminous, sf, suvastik, waree } from '../assets';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Companies = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const companiesRef = useRef([]);

  const companies = [
    { name: 'Adani', logo: adani },
    { name: 'Amaron', logo: amaron },
    { name: 'APC', logo: apc },
    { name: 'Dynax', logo: dynax },
    { name: 'Excide', logo: excide },
    { name: 'Livfast', logo: livfast },
    { name: 'Luminous', logo: luminous },
    { name: 'SF', logo: sf },
    { name: 'Suvastik', logo: suvastik },
    { name: 'Waree', logo: waree }
  ];

  useEffect(() => {
    // Animate title
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate company logos with stagger
    gsap.fromTo(
      companiesRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  // Function to add elements to the ref array
  const addToRefs = (el) => {
    if (el && !companiesRef.current.includes(el)) {
      companiesRef.current.push(el);
    }
  };

  return (
    <div ref={sectionRef} className='flex justify-center py-16 bg-white'>
      <div className='w-full max-w-7xl px-6'>
        <h2 ref={titleRef} className='text-3xl font-bold text-center mb-12 text-[#008246]'>Our Partner Companies</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {companies.map((company, index) => (
            <div 
              key={index}
              ref={addToRefs}
              className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center group'
            >
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                className='max-h-16 md:max-h-20 object-contain group-hover:scale-110 transition-transform duration-300'
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#008246] text-white text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm rounded-b-lg">
                {company.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;