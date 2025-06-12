import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Homeowner, Delhi',
    message: 'The inverter I purchased from Energy Storage System has been incredibly reliable during power outages. Their customer service was exceptional from start to finish.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    name: 'Priya Sharma',
    role: 'Business Owner, Mumbai',
    message: 'We equipped our entire office with UPS systems from Energy Storage System. The quality is outstanding and their technical support team is always available when needed.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    name: 'Amit Singh',
    role: 'Solar Enthusiast, Bangalore',
    message: 'Their solar solutions have reduced my electricity bills by 70%. The installation team was professional and completed the setup ahead of schedule.',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
];

export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const testimonialRef = useRef(null);
  const slideRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      setIndex((prev) => (prev + 1) % testimonials.length);
    } else if (e.key === 'ArrowLeft') {
      setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Initial animation
    gsap.fromTo(
      testimonialRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    // Animate slide transition
    gsap.fromTo(
      slideRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
    );
  }, [index]);

  const nextTestimonial = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div ref={testimonialRef} className="w-full py-20 bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]">
    <div className="container mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-[#008246] mb-3">What Our Customers Say</h2>
        <p className="text-base md:text-lg text-gray-700">
          Real stories. Real impact. Discover how Energy Storage System empowers lives across India.
        </p>
      </div>
      <div className="max-w-4xl mx-auto relative">
        {/* Testimonial Card */}
        <div
          ref={slideRef}
          className="bg-white rounded-2xl shadow-2xl px-4 py-10 md:px-12 md:py-14 relative overflow-visible transition-all duration-300 border-4 border-[#e4c73f33] hover:border-[#E4C73F]/60 group"
        >
          {/* Animated Gradient Border Glow (optional) */}
          <span className="absolute inset-0 rounded-2xl pointer-events-none group-hover:shadow-[0_0_32px_8px_#E4C73F44] transition-all duration-300"></span>
          {/* Big Quote Mark */}
          <div className="absolute -top-6 left-6 md:left-12 text-8xl text-[#E4C73F] opacity-20 font-serif select-none pointer-events-none transition-transform duration-300 group-hover:scale-110">
            &ldquo;
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#E4C73F] shadow-lg transition-transform duration-300 group-hover:scale-105">
              <img
                src={testimonials[index].avatar}
                alt={testimonials[index].name}
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
            {/* Content */}
            <div className="flex-1">
              <p className="text-lg md:text-xl text-gray-800 font-medium italic mb-6 transition-colors duration-300">
                "{testimonials[index].message}"
              </p>
              <div>
                <h4 className="text-xl font-bold text-[#008246]">{testimonials[index].name}</h4>
                <span className="text-sm text-gray-500">{testimonials[index].role}</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Navigation */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#E4C73F] transition-all group"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-[#008246]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Dots */}
          <div className="flex items-center space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === i ? 'bg-[#008246]' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#E4C73F] transition-all group"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-[#008246]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
  
        {/* Keyboard shortcut hint */}
        <div className="absolute top-3 right-5 text-gray-400 text-xs md:block">
          <span className="hidden md:inline">Use &larr; / &rarr; keys to navigate</span>
        </div>
      </div>
    </div>
  </div>
  
  );
}