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
    <div ref={sectionRef} className='flex justify-center py-16 bg-gray-50'>
      <div className='w-full max-w-7xl flex flex-col md:flex-row items-center gap-10 px-6 md:px-14'>
        <div 
          ref={imageRef}
          className='w-full md:w-1/3 h-[250px] md:h-[300px] rounded-lg shadow-lg overflow-hidden' 
          style={{
            backgroundImage: `url(${about})`,
            backgroundPosition: "center",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
        </div>
        <div ref={textRef} className='w-full md:w-2/3'>
          <h1 className='text-2xl md:text-3xl font-bold text-[#008246] mb-4'>Stay Powered – Premium Inverter Batteries Online</h1>
          <p className='text-gray-700 leading-relaxed'>
            Energy Store System is one of India's leading online battery platforms, built to offer a fast, simple, and reliable way to purchase high-performance batteries at competitive prices—whether online or over the phone. All prices listed include GST, ensuring complete pricing transparency. By sourcing directly from certified manufacturers, we cut out middlemen and pass the savings and quality directly to you.
            <br /><br />
            As one of the country's fastest-growing stored energy providers, we're committed to delivering expert advice, a wide selection of battery solutions, and dependable customer service—all while keeping our prices highly competitive.
            <br /><br />
            At Energy Store System, buying a battery is effortless. We serve a wide spectrum of clients—from individuals to wholesalers and industrial businesses—offering top-tier products for various applications. Our mission is to power your needs efficiently, affordably, and reliably.
          </p>
          <button className="mt-6 px-6 py-2 bg-[#E4C73F] text-black font-semibold rounded-md hover:bg-[#d4b82f] transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Batteries;