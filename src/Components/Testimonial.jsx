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
    <div ref={testimonialRef} className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#008246]">What Our Customers Say</h2>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial Card */}
          <div 
            ref={slideRef}
            className="bg-white rounded-xl shadow-lg p-8 md:p-10 relative overflow-hidden"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-6xl text-[#E4C73F] opacity-20 font-serif">
              "
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#E4C73F]">
                <img 
                  src={testimonials[index].avatar} 
                  alt={testimonials[index].name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <p className="text-lg md:text-xl text-gray-700 italic mb-6">"{testimonials[index].message}"</p>
                <div>
                  <h4 className="text-xl font-semibold text-[#008246]">{testimonials[index].name}</h4>
                  <span className="text-sm text-gray-500">{testimonials[index].role}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#E4C73F] transition-colors"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Dots */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === i ? 'bg-[#008246]' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#E4C73F] transition-colors"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="absolute top-2 right-4 text-gray-400 text-sm hidden md:block">
            Use ← / → keys to navigate
          </div>
        </div>
      </div>
    </div>
  );
}