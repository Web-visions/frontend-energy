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
    <div ref={sectionRef} className="flex justify-center py-20 bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]">
    <div className="w-full max-w-7xl px-6">
      <h2 ref={titleRef} className="text-3xl md:text-4xl font-black text-center mb-12 text-[#008246] tracking-tight">
        Our Partner Companies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {companies.map((company, index) => (
          <div
            key={company.name}
            ref={el => {
              companiesRef.current[index] = el;
            }}
            className="relative bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex items-center justify-center group transition-all duration-300 min-h-[110px]"
          >
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="max-h-16 md:max-h-20 object-contain mx-auto transition-transform duration-300 group-hover:scale-110
                group-hover:drop-shadow-lg
                /* grayscale hover effect (uncomment if you want) */
                /* grayscale group-hover:grayscale-0 */
              "
              draggable="false"
            />
            {/* Hover Overlay with company name */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#008246]/95 text-white text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs rounded-b-2xl font-semibold tracking-wide">
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