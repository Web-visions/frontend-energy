import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { NavLink } from 'react-router-dom';

const MenuDropdown = ({ title, items }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    const dropdown = e.currentTarget.querySelector('.dropdown-content');
    gsap.killTweensOf(dropdown);
    gsap.fromTo(
      dropdown,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  };
  
  const handleMouseLeave = (e) => {
    setIsHovered(false);
    const dropdown = e.currentTarget.querySelector('.dropdown-content');
    gsap.killTweensOf(dropdown);
    gsap.to(dropdown, { 
      opacity: 0, 
      y: -10, 
      duration: 0.2, 
      ease: "power2.in"
    });
  };

  return (
    <li 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center cursor-pointer">
        <NavLink 
          to={`/${title.toLowerCase()}`} 
          className={({ isActive }) =>
            `font-semibold text-base flex items-center ${isActive ? 'text-[#008246]' : 'text-black hover:text-[#008246]'} transition-colors`
          }
        >
          <span>{title}</span>
          <ChevronDown 
            size={16} 
            className={`ml-1 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} 
          />
        </NavLink>
      </div>
      
      <div 
        className={`dropdown-content absolute left-0 mt-1 z-50 bg-white rounded-md shadow-xl border border-gray-100 min-w-48 ${isHovered ? 'block' : 'hidden'}`}
        style={{ opacity: 0, transformOrigin: 'top center' }}
      >
        <div className="py-2">
          {items.map((item, index) => (
            <NavLink 
              key={index} 
              to={`/${title.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `block px-5 py-2 text-sm ${isActive ? 'text-[#008246] bg-gray-50' : 'hover:bg-gray-50 hover:text-[#008246]'} transition-colors duration-200`
              }
            >
              {item}
            </NavLink>
          ))}
        </div>
      </div>
    </li>
  );
};

export default MenuDropdown;