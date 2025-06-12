import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { about } from '../assets';

const AboutUs = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Create a timeline for sequential animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate the title
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2 }
    );

    // Animate the text
    tl.fromTo(
      textRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      "-=0.8" // Start slightly before the previous animation finishes
    );

    // Animate the button
    tl.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        onComplete: () => {
          // Add the bounce animation after the button appears
          gsap.to(buttonRef.current, {
            y: "-10px",
            repeat: -1,
            yoyo: true,
            duration: 1,
            ease: "power1.inOut"
          });
        }
      },
      "-=0.5" // Start slightly before the previous animation finishes
    );

    // Create a parallax effect on scroll
    gsap.to(sectionRef.current.querySelector('.parallax-bg'), {
      backgroundPosition: "50% 30%",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
  {/* Parallax Background */}
  <div 
    className="absolute inset-0 z-0 parallax-bg"
    style={{
      backgroundImage: `url(${about})`,
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#00824699]"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-3xl md:max-w-4xl mx-auto px-6 py-20 text-center">
    <div className="space-y-8">
      <h1
        ref={titleRef}
        className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg"
      >
        <span className="block text-[#E4C73F] mb-1 text-base md:text-lg font-bold tracking-widest uppercase">
          About Us
        </span>
        <span>
          Empowering India with <span className="text-[#E4C73F]">Next-Gen</span> Power Solutions
        </span>
      </h1>
      <p
        ref={textRef}
        className="text-lg md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto"
      >
        We are pioneers in inverter systems, batteries, and solar energy—providing future-ready backup solutions for every home, business, and industry.
        <br />
        <span className="mt-2 block text-white/80 text-base">
          From residential apartments to commercial giants, we deliver reliability, expertise, and trust across India.
        </span>
      </p>
      <button
        ref={buttonRef}
        className="mt-8 px-10 py-3 bg-gradient-to-r from-[#E4C73F] to-[#ffe477] text-[#008246] font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#d4b82f] focus:outline-none focus:ring-2 focus:ring-[#E4C73F] focus:ring-offset-2 text-lg"
      >
        Explore Our Solutions
      </button>
    </div>
  </div>
</div>

  );
};

export default AboutUs;