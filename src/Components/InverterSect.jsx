import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getData } from '../utils/http';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const InverterSect = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardContainerRef = useRef(null);

  useEffect(() => {
    // Fetch 20 latest featured products
    getData('/products/featured', { limit: 20 })
      .then(data => setProducts(data.data || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    // Animate section title
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  // Slider logic
  const visibleCards = 4; // Number of cards visible at once (adjust for responsiveness if needed)
  const maxIndex = Math.max(0, products.length - visibleCards);

  const handlePrev = () => {
    setCurrentIndex(idx => Math.max(0, idx - 1));
  };
  const handleNext = () => {
    setCurrentIndex(idx => Math.min(maxIndex, idx + 1));
  };

  useEffect(() => {
    if (cardContainerRef.current) {
      gsap.to(cardContainerRef.current, {
        x: `-${currentIndex * 100}%`,
        duration: 0.6,
        ease: 'power3.inOut',
      });
    }
  }, [currentIndex]);

  return (
    <div ref={sectionRef} className="container mx-auto px-4 py-20 bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]">
      {/* Featured Products Section */}
      <section>
        <h1
          ref={titleRef}
          className="text-3xl md:text-4xl font-black mb-10 text-center md:text-left text-[#008246] relative"
        >
          Featured Products
          <span className="absolute left-1/2 md:left-0 -bottom-2 w-28 h-1 bg-[#E4C73F] rounded-full -translate-x-1/2 md:translate-x-0 transition-all duration-300"></span>
        </h1>
        <div className="relative">
          {/* Slider Controls */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-[#E4C73F] text-[#008246] rounded-full p-3 shadow transition-all disabled:opacity-40"
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-[#E4C73F] text-[#008246] rounded-full p-3 shadow transition-all disabled:opacity-40"
            aria-label="Next"
          >
            &#8594;
          </button>
          {/* Cards Slider */}
          <div className="overflow-hidden">
            <div
              ref={cardContainerRef}
              className="flex transition-transform duration-500"
              style={{ width: `${products.length * 25}%` }}
            >
              {products.map((product, idx) => (
                <div
                  key={product._id}
                  className="w-1/4 px-3 flex-shrink-0"
                  style={{ minWidth: '25%' }}
                >
                  <div className="relative bg-white rounded-2xl shadow-md group hover:shadow-2xl overflow-hidden transition-all duration-300">
                    {/* Ribbon */}
                    <span className="absolute top-3 left-3 bg-[#E4C73F]/90 text-[#008246] text-xs font-bold px-3 py-1 rounded shadow-md z-10 uppercase tracking-wider">
                      Featured
                    </span>
                    {/* Image */}
                    <div className="relative h-56 md:h-64 w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#e4c73f1a] to-[#00824611]">
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        draggable="false"
                      />
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">{product.name}</h3>
                      <p className="text-center text-[#008246] font-bold text-lg mb-4">₹{product.mrp?.toLocaleString() || product.sellingPrice?.toLocaleString() || 'N/A'}</p>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InverterSect;