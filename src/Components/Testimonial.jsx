import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Homeowner, Delhi",
    message:
      "The inverter I purchased from Energy Storage System has been incredibly reliable during power outages. Their customer service was exceptional from start to finish.",
    avatar:
      "https://images.unsplash.com/flagged/photo-1571367034861-e6729ad9c2d5?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Priya Sharma",
    role: "Business Owner, Mumbai",
    message:
      "We equipped our entire office with UPS systems from Energy Storage System. The quality is outstanding and their technical support team is always available when needed.",
    avatar:
      "https://plus.unsplash.com/premium_photo-1682092039530-584ae1d9da7f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Amit Singh",
    role: "Solar Enthusiast, Bangalore",
    message:
      "Their solar solutions have reduced my electricity bills by 70%. The installation team was professional and completed the setup ahead of schedule.",
    avatar:
      "https://images.unsplash.com/photo-1534235187448-833893dfe3e0?q=80&w=449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const testimonialRef = useRef(null);
  const slideRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") setIndex((p) => (p + 1) % testimonials.length);
    else if (e.key === "ArrowLeft")
      setIndex((p) => (p - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Initial fade-in
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        testimonialRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // Animate each slide; kill previous tweens to avoid conflicts
  useEffect(() => {
    if (!slideRef.current) return;
    gsap.killTweensOf(slideRef.current);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        slideRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
      );
    }, slideRef);
    return () => ctx.revert();
  }, [index]);

  const nextTestimonial = () => setIndex((p) => (p + 1) % testimonials.length);
  const prevTestimonial = () =>
    setIndex((p) => (p - 1 + testimonials.length) % testimonials.length);

  const active = testimonials[index];

  return (
    <div
      ref={testimonialRef}
      className="w-full py-20 bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]"
    >
      <div className="container mx-auto px-6">
        {/* header ... */}

        <div className="max-w-4xl mx-auto relative">
          <div
            ref={slideRef}
            // Key the whole slide so React remounts content (including <img>) on index change
            key={index}
            className="bg-white rounded-2xl shadow-2xl px-4 py-10 md:px-12 md:py-14 relative overflow-visible transition-all duration-300 border-4 border-[#e4c73f33] hover:border-[#E4C73F]/60 group"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
              {/* Avatar */}
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#E4C73F] shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  // Key the img too, belt-and-suspenders
                  key={active.avatar}
                  src={active.avatar}
                  alt={active.name}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-lg md:text-xl text-gray-800 font-medium italic mb-6">
                  "{active.message}"
                </p>
                <div>
                  <h4 className="text-xl font-bold text-[#008246]">
                    {active.name}
                  </h4>
                  <span className="text-sm text-gray-500">{active.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* nav buttons + dots (unchanged) */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#E4C73F] transition-all group"
              aria-label="Previous testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:text-[#008246]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === i ? "bg-[#008246]" : "bg-gray-300"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:text-[#008246]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="absolute top-3 right-5 text-gray-400 text-xs md:block">
            <span className="hidden md:inline">
              Use &larr; / &rarr; keys to navigate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
