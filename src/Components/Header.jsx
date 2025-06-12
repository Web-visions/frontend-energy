import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingCart, 
  User,
  Sun,
  Battery,
  Zap,
  ChevronDown,
  Link
} from 'lucide-react';
import logo from '../assets/logo.jpg'
import { NavLink } from 'react-router-dom';



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Demo cart count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Solar Panels', href: '/products', icon: Sun },
    { name: 'Batteries', href: '/products', icon: Battery },
    { name: 'UPS Systems', href: '/products', icon: Zap },
    { name: 'Inverters', href: '/products', icon: null },
    // { name: 'Services', href: '/services', icon: null },
    // { name: 'About', href: '/about', icon: null },
    { name: 'Contact', href: '/contact', icon: null },
  ];

  return (
   <>
   
   <header
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg'
      : 'bg-gradient-to-r from-[#008246] to-[#009c55]'
  }`}
>
  {/* Top Contact Bar */}
  <div
    className={`transition-all duration-300 ${
      isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
    }`}
  >
    <div className="bg-gradient-to-r from-[#E4C73F] to-[#f7da5e] text-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10 text-sm">
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span className="font-medium">24/7 Support: +91-987654321</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>info@solarenergy.com</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <MapPin size={14} />
              <span>Free Installation Across India</span>
            </div>
            {/* <div className="text-xs font-bold px-2 py-1 bg-black/10 rounded">
  🚀 Join the Solar Revolution with Us!
</div> */}

          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Main Navigation */}
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <NavLink to='/' className="flex items-center space-x-3">
        <img
          src={logo}
          alt="Solar Energy"
          className="h-12"
          />
      </NavLink>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        {navigationItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
              isScrolled
                ? 'text-gray-700 hover:text-[#008246] hover:bg-[#008246]/5'
                : 'text-white hover:text-[#E4C73F] hover:bg-white/10'
            } relative group`}
          >
            {item.icon && React.createElement(item.icon, { size: 18 })}
            <span>{item.name}</span>
            <div
              className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                isScrolled ? 'bg-[#008246]' : 'bg-[#E4C73F]'
              }`}
            ></div>
          </a>
        ))}
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <button
          onClick={toggleSearch}
          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
            isScrolled
              ? 'text-gray-700 hover:bg-[#008246]/10 hover:text-[#008246]'
              : 'text-white hover:bg-white/10'
          } ${searchActive ? 'bg-[#E4C73F] text-black' : ''}`}
        >
          <Search size={20} />
        </button>

        {/* Cart */}
        <button
          className={`relative p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
            isScrolled
              ? 'text-gray-700 hover:bg-[#008246]/10 hover:text-[#008246]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E4C73F] text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Account */}
        <button
          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
            isScrolled
              ? 'text-gray-700 hover:bg-[#008246]/10 hover:text-[#008246]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <User size={20} />
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
            isScrolled
              ? 'text-gray-700 hover:bg-[#008246]/10'
              : 'text-white hover:bg-white/10'
          }`}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* CTA Button */}
        <button className="hidden md:block bg-gradient-to-r from-[#E4C73F] to-[#f7da5e] text-black px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
          Get Quote
        </button>
      </div>
    </div>
  </div>

  {/* Search Bar */}
  <div
    className={`transition-all duration-300 overflow-hidden ${
      searchActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    <div className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for solar panels, batteries, UPS systems..."
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#008246] focus:outline-none transition-colors"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#008246] transition-colors">
              <Search size={20} />
            </button>
          </div>
          <button
            onClick={toggleSearch}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Search Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'Solar Panels',
            'Lithium Batteries',
            'Online UPS',
            'Solar Inverter',
            'Home Battery',
          ].map((term, index) => (
            <button
              key={index}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#008246] hover:text-white rounded-full transition-all duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  <div
    className={`lg:hidden transition-all duration-300 ${
      isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
    } overflow-hidden`}
  >
    <div className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <nav className="space-y-4">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#008246]/5 hover:text-[#008246] transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon && React.createElement(item.icon, { size: 20, className: "text-[#008246]" })}
              <span className="font-medium">{item.name}</span>
            </a>
          ))}

          {/* Mobile CTA */}
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full bg-gradient-to-r from-[#008246] to-[#009c55] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Get Free Solar Quote
            </button>
          </div>

          {/* Mobile Contact Info */}
          <div className="pt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone size={16} className="text-[#008246]" />
              <span>+91-987654321</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-[#008246]" />
              <span>info@solarenergy.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-[#008246]" />
              <span>Free Installation Across India</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>

    
   </>
  );
};

export default Header;