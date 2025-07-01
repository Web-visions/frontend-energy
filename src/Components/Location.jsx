import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Location = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const mapRef = useRef(null);
  const infoRef = useRef(null);

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

    // Animate map
    gsap.fromTo(
      mapRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate info
    gsap.fromTo(
      infoRef.current,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div ref={sectionRef} className="container mx-auto px-4 py-20 bg-gradient-to-b from-white via-[#f7fafd] to-[#eafaf2]">
      <h1 ref={titleRef} className="text-3xl md:text-4xl font-black text-center mb-4 text-[#008246] tracking-tight">
        Visit Our Experience Centre
      </h1>
      <p className="text-center text-gray-700 mb-12 text-base md:text-lg">
        Let's talk energy, technology, and a greener future—right at our headquarters in Gurugram.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        {/* Map Section */}
        <div
          ref={mapRef}
          className="w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#e4c73f33] animate-pulse-slow"
          style={{
            boxShadow: '0 8px 36px 0 #e4c73f22'
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.939733125546!2d77.03743231506745!3d28.457883182484868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18a1eb0aa0b9%3A0x9b6b9e9e9b9b9b9b!2sBinary%20Electricals%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1621234567890!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Energy Storage System Location"
          ></iframe>
        </div>

        {/* Directions Section */}
        <div
          ref={infoRef}
          className="flex flex-col justify-between bg-white rounded-2xl shadow-xl p-8"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#008246]">Our Location</h2>
            <div className="space-y-2 text-gray-700 mb-4">
              <p className="flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E4C73F] animate-bounce-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#008246]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="font-semibold">Energy Storage System</span>
              </p>
              <p className="pl-9">LT Atul Kataria Marg, Part-6</p>
              <p className="pl-9">Sector 6, Gurugram, Haryana 122001</p>
            </div>

            <div className="space-y-2 mb-6">
              <p className="flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E4C73F] animate-spin-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#008246]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <a href="tel:8929490346" className="text-[#008246] font-semibold hover:underline">8929490346</a>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E4C73F] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#008246]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a href="mailto:connect@energystoragesystem.in" className="text-[#008246] font-semibold hover:underline">connect@energystoragesystem.in</a>
              </p>
            </div>

            <h3 className="text-lg font-semibold text-[#008246] mb-2">Working Hours</h3>
            <div className="mb-4 text-sm">
              <p>Open all days (Monday - Sunday) from 9:30 AM to 8:00 PM</p>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/voezfGw8UqnVDhLUA?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-gradient-to-r from-[#008246] to-[#00b257] text-white w-full text-center px-6 py-3 rounded-full hover:bg-[#006a38] transition-colors duration-300 font-bold shadow-lg text-base"
          >
            Get Live Directions
          </a>
        </div>
      </div>
    </div>

  );
};

export default Location;