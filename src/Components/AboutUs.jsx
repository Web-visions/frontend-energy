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
    <div ref={sectionRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="space-y-8">
          <h1 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            ENERGY STORAGE SYSTEM IS A LEADING<br />POWER BACKUP SOLUTION
          </h1>
          <p ref={textRef} className="text-lg md:text-xl text-white/90 leading-relaxed">
            SPECIALIZING IN INVERTER SYSTEMS, BATTERIES, AND SOLAR SOLUTIONS FOR BOTH RESIDENTIAL AND COMMERCIAL NEEDS
          </p>
          <button 
            ref={buttonRef}
            className="mt-8 px-8 py-3 bg-[#E4C73F] text-black font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:bg-[#d4b82f] focus:outline-none focus:ring-2 focus:ring-[#E4C73F] focus:ring-offset-2"
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;