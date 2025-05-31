import React, { useState, useEffect, useRef } from 'react';
import { LogIn, User, ShoppingCart, Menu, X, Search, ChevronDown } from "lucide-react";
import MenuDropdown from './MenuDropdown';
import gsap from 'gsap';
import logo from '../assets/logo.jpg'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const topBarRef = useRef(null);
  const searchInputRef = useRef(null);
  const categoryMenuItems = [
    {
      title: "Inverter",
      items: ["Commercial Inverter", "Home Inverter", "Hybrid Inverter", "Grid-Tie Inverter"]
    },
    {
      title: "UPS",
      items: ["On-line UPS", "Off-line UPS", "Line-Interactive UPS", "Industrial UPS"]
    },
    {
      title: "Batteries",
      items: ["Lithium-ion Batteries", "Lead Acid Batteries", "LiFePO4 Batteries", "Deep Cycle Batteries"]
    },
    {
      title: "Solar Products",
      items: ["Solar Panels", "Solar Inverters", "Solar Charge Controllers", "Solar Accessories", "Solar Mounting Systems"]
    },
    {
      title: "Stabilizers",
      items: ["Automatic Voltage Stabilizers", "Servo Stabilizers", "Industrial Stabilizers"]
    },
    {
      title: "Battery Water",
      items: []
    }
  ];

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      topBarRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    ).fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.3"
    ).fromTo(
      navRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      "-=0.4"
    );
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate header elements when scrolled
    if (isScrolled) {
      gsap.to(headerRef.current, {
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        duration: 0.3
      });
    } else {
      gsap.to(headerRef.current, {
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        duration: 0.3
      });
    }
  }, [isScrolled]);

  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (!searchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    if (!isMenuOpen) {
      // Animate menu opening
      gsap.fromTo(
        ".mobile-menu",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  };

  return (
    <header 
      ref={headerRef} 
      className={`sticky top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'shadow-xl' : 'shadow-md'
      }`}
    >
      {/* Top bar */}
      <div 
        ref={topBarRef}
        className="w-full h-10 bg-gradient-to-r from-[#E4C73F] to-[#f7da5e] flex justify-center items-center"
      >
        <div className="container px-4 md:px-6 flex justify-between items-center text-sm font-medium">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-[#008246] font-bold">24/7 Support:</span>
            <a href="tel:+1234567890" className="hover:text-[#008246] transition-colors">+91-987654321</a>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            <button 
              onClick={toggleSearch} 
              className="flex items-center hover:text-[#008246] transition-colors"
              aria-label="Search"
            >
              <Search size={18} className="mr-1" />
              <span className="hidden md:inline">Search</span>
            </button>
            
            <a href="#" className="flex items-center hover:text-[#008246] transition-colors">
              <LogIn size={18} className="mr-1" />
              <span>Login</span>
            </a>
            
            <a href="#" className="hidden md:flex items-center hover:text-[#008246] transition-colors">
              <User size={18} className="mr-1" />
              <span>Account</span>
            </a>
            
            <a href="#" className="flex items-center hover:text-[#008246] transition-colors">
              <ShoppingCart size={18} className="mr-1" />
              <span className="hidden md:inline">Cart</span>
              <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs bg-[#E4C73F] text-black rounded-full">0</span>
            </a>
          </div>
        </div>
      </div>

      {/* Search bar - appears when active */}
      {searchActive && (
        <div className="w-full bg-white border-b border-gray-200 py-3 px-4 md:px-6 animate-fade-in">
          <div className="container mx-auto flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-l-md border-l border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008246] focus:border-transparent"
            />
            <button className="bg-[#008246] hover:bg-[#006d3b] text-white px-4 py-2 rounded-r-md transition-colors">
              <Search size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main navigation */}
      <div className="w-full bg-gradient-to-r from-[#008246] to-[#009c55] flex items-center px-4 md:px-6">
        <div className="container mx-auto py-3 md:py-0 flex justify-between items-center">
          {/* Logo with animation */}
          <div ref={logoRef} className="relative h-16 md:h-20 flex items-center">
            <img 
              src={logo} 
              alt="Energy Storage System Logo" 
              className="h-12 md:h-16 object-contain rounded-md transition-all duration-1000 ease-in-out" 
            />
          </div>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden md:block">
            <ul className="flex items-center space-x-6 lg:space-x-11">
              <li className="group">
                <a 
                  href="/" 
                  className="py-6 inline-block font-semibold text-white text-lg group-hover:text-[#E4C73F] transition-colors duration-300 relative"
                >
                  Home
                  <span className="absolute bottom-4 left-0 w-0 h-0.5 bg-[#E4C73F] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li className="group">
                <a 
                  href={'/services'}
                  className="py-6 inline-block font-semibold text-white text-lg group-hover:text-[#E4C73F] transition-colors duration-300 relative"
                >
                  Services
                  <span className="absolute bottom-4 left-0 w-0 h-0.5 bg-[#E4C73F] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li className="group">
                <a 
                  href="/contact" 
                  className="py-6 inline-block font-semibold text-white text-lg group-hover:text-[#E4C73F] transition-colors duration-300 relative"
                >
                  Contact
                  <span className="absolute bottom-4 left-0 w-0 h-0.5 bg-[#E4C73F] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li className="group">
                <a 
                  href="#" 
                  className="py-6 inline-block font-semibold text-white text-lg group-hover:text-[#E4C73F] transition-colors duration-300 relative"
                >
                  Coming Soon
                  <span className="absolute bottom-4 left-0 w-0 h-0.5 bg-[#E4C73F] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li className="group">
                <a 
                  href="/help" 
                  className="py-6 inline-block font-semibold text-white text-lg group-hover:text-[#E4C73F] transition-colors duration-300 relative"
                >
                  Help
                  <span className="absolute bottom-4 left-0 w-0 h-0.5 bg-[#E4C73F] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="mobile-menu md:hidden bg-white shadow-lg border-t border-gray-100 z-50">
          <nav className="container mx-auto py-4">
            <ul className="space-y-4 px-4">
              <li className="font-semibold text-[#008246] hover:text-[#E4C73F] transition-colors">
                <a href="#" className="block py-2 border-b border-gray-100">Home</a>
              </li>
              <li className="font-semibold text-[#008246] hover:text-[#E4C73F] transition-colors">
                <a href="#" className="block py-2 border-b border-gray-100">Services</a>
              </li>
              <li className="font-semibold text-[#008246] hover:text-[#E4C73F] transition-colors">
                <a href="#" className="block py-2 border-b border-gray-100">Contact</a>
              </li>
              <li className="font-semibold text-[#008246] hover:text-[#E4C73F] transition-colors">
                <a href="#" className="block py-2 border-b border-gray-100">Coming Soon</a>
              </li>
              <li className="font-semibold text-[#008246] hover:text-[#E4C73F] transition-colors">
                <a href="#" className="block py-2 border-b border-gray-100">Help</a>
              </li>
              
              {/* Mobile category menus with accordions */}
              {categoryMenuItems.map((category, index) => (
                <MobileAccordion 
                  key={index} 
                  title={category.title} 
                  items={category.items} 
                />
              ))}
              
              <li className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex flex-col space-y-3">
                  <a href="#" className="flex items-center text-[#008246] hover:text-[#E4C73F] transition-colors">
                    <LogIn size={18} className="mr-2" />
                    <span>Login</span>
                  </a>
                  <a href="#" className="flex items-center text-[#008246] hover:text-[#E4C73F] transition-colors">
                    <User size={18} className="mr-2" />
                    <span>Account</span>
                  </a>
                  <a href="#" className="flex items-center text-[#008246] hover:text-[#E4C73F] transition-colors">
                    <ShoppingCart size={18} className="mr-2" />
                    <span>Cart</span>
                  </a>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Bottom navbar with category menu - Enhanced z-index */}
      <div className="w-full h-12 bg-white bg-opacity-95 shadow-sm hidden md:flex justify-center border-b border-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex items-center h-full">
            <nav className="flex justify-center w-full">
              <ul className="flex items-center space-x-8 lg:space-x-12">
                {categoryMenuItems.map((category, index) => (
                  category.items.length > 0 ? (
                    <MenuDropdown 
                      key={index} 
                      title={category.title} 
                      items={category.items} 
                    />
                  ) : (
                    <li key={index} className="group">
                      <a 
                        href="#" 
                        className="font-semibold text-black text-base hover:text-[#008246] transition-colors duration-200"
                      >
                        {category.title}
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

// Mobile accordion component for category submenus
const MobileAccordion = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    
    if (contentRef.current) {
      if (!isOpen) {
        gsap.fromTo(
          contentRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(contentRef.current, { 
          height: 0, 
          opacity: 0, 
          duration: 0.2, 
          ease: "power2.in" 
        });
      }
    }
  };
  
  return (
    <li className="border-b border-gray-100">
      <div 
        className="flex items-center justify-between py-2 cursor-pointer"
        onClick={toggleAccordion}
      >
        <span className="font-semibold text-[#008246]">{title}</span>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>
      
      <div 
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        {items.length > 0 && (
          <ul className="pl-4 py-2 space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="text-gray-700 hover:text-[#008246] transition-colors">
                <a href="#" className="block py-1 text-sm">{item}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default Header;