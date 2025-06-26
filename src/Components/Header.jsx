import React, { useState, useEffect, useRef } from "react";
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
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import logo from "../assets/logo.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import MenuDropdown from './MenuDropdown';
import LogoutModal from './LogoutModal';
import LeadFormModal from './LeadFormModal';

const navigationItems = [
  { name: "Home", href: "/", icon: null },
  {
    name: "Solar",
    href: "/products?type=solar-pv",
    icon: Sun,
    dropdown: [
      { name: "Solar PCU", href: "/products?type=solar-pcu" },
      { name: "Solar PV", href: "/products?type=solar-pv" },
      { name: "Solar Street Light", href: "/products?type=solar-street-light" }
    ]
  },
  {
    name: "Solar Projects",
    href: "#",
    icon: Sun,
    dropdown: [
      { name: "Off Grid Project", href: "#", type: "off-grid-lead" },
      { name: "On Grid Project", href: "#", type: "on-grid-lead" },
      { name: "Hybrid Project", href: "#", type: "hybrid-lead" }
    ]
  },
  { name: "Batteries", href: "/products?type=battery", icon: Battery },
  { name: "UPS", href: "/products?type=ups", icon: Zap },
  { name: "Inverters", href: "/products?type=inverter", icon: null },
  // { name: "Contact", href: "/contact", icon: null },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [cartCount] = useState(3); // Demo cart count
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState(null);
  const { cart } = useCart();

  // Dropdown for user profile
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    }
    if (userDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdown]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleSearch = () => setSearchActive((prev) => !prev);

  const handleLeadFormOpen = (projectType) => {
    setSelectedProjectType(projectType);
    setShowLeadModal(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleLeadFormClose = () => {
    setShowLeadModal(false);
    setSelectedProjectType(null);
  };

  // Role-based dashboard routes
  const getDashboardRoute = () => {
    if (!currentUser) return "/";
    switch (currentUser.role) {
      case "admin":
        return "/dashboard/admin";
      case "staff":
        return "/dashboard/staff";
      default:
        return "/dashboard/user";
    }
  };

  // Calculate cart item count
  const cartItemCount = cart?.items?.length || 0;

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-white via-[#009c55] to-[#008246]"
          }`}
      >
        {/* Top Bar */}
        <div
          className={`transition-all duration-300 ${isScrolled ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"
            }`}
        >
          {/* <div className="bg-gradient-to-r from-[#E4C73F] to-[#f7da5e] text-black">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-10 text-sm">
                <div className="hidden md:flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Phone size={14} />
                    <span className="font-medium">
                      24/7 Support: +91-987654321
                    </span>
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
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Main Nav */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-3">
              <img src={logo} alt="Solar Energy" className="h-24" />
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative group">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${isScrolled
                        ? "text-gray-700 hover:text-[#008246] hover:bg-[#008246]/5"
                        : "text-black hover:text-[#008246] hover:bg-black/5"
                      } relative ${isActive ? (isScrolled ? "font-bold text-[#008246]" : "font-bold text-[#008246]") : ""
                      }`
                    }
                    end
                  >
                    {item.icon && React.createElement(item.icon, { size: 18 })}
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDown size={16} className="ml-1" />}
                  </NavLink>

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top">
                      {item.dropdown.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={() => subItem.type ? handleLeadFormOpen(subItem.type) : navigate(subItem.href)}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-[#008246]/5 hover:text-[#008246] transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={toggleSearch}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isScrolled
                  ? "text-gray-700 hover:bg-[#008246]/10 hover:text-[#008246]"
                  : "text-black hover:bg-black/5"
                  } ${searchActive ? "bg-[#E4C73F] text-black" : ""}`}
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <NavLink
                to="/cart"
                className={`relative p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isScrolled
                  ? "text-gray-700 hover:bg-[#008246]/10 hover:text-[#008246]"
                  : "text-black hover:bg-black/5"
                  }`}
              >
                <FiShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#008246] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </NavLink>

              {/* Authenticated User */}
              {!loading && currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${isScrolled
                      ? "text-gray-700 hover:bg-[#008246]/10 hover:text-[#008246]"
                      : "text-black hover:bg-black/5"
                      }`}
                    onClick={() => setUserDropdown((prev) => !prev)}
                  >
                    <User size={22} className="mr-2" />
                    <span className="hidden md:inline font-semibold">
                      {currentUser.name || currentUser.firstName}
                    </span>
                    <ChevronDown size={18} className="ml-1" />
                  </button>
                  {/* Dropdown */}
                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border py-2 z-40 animate-fade-in">
                      <div className="px-4 py-2 border-b">
                        <div className="font-bold text-[#008246] truncate">{currentUser.name || currentUser.firstName}</div>
                        <div className="text-xs text-gray-600 truncate">{currentUser.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          navigate(getDashboardRoute());
                          setUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#f7da5e]/30 transition text-[#008246] font-semibold"
                      >
                        <LayoutDashboard size={18} /> Dashboard
                      </button>
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 transition"
                      >
                        <FiLogOut className="h-5 w-5" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Login / Signup Buttons */}
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 bg-[#008246] text-white rounded-lg font-semibold hover:bg-[#009c55] transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-5 py-2 border-2 border-[#008246] text-[#008246] rounded-lg font-semibold ml-2 hover:bg-[#008246]/10 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMenu}
                className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${isScrolled
                  ? "text-gray-700 hover:bg-[#008246]/10"
                  : "text-black hover:bg-black/5"
                  }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`transition-all duration-300 overflow-hidden ${searchActive ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
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
              {/* Quick Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {["Solar Panels", "Lithium Batteries", "Online UPS", "Solar Inverter", "Home Battery"].map(
                  (term, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#008246] hover:text-white rounded-full transition-all duration-200"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
        >
          <div className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-6">
              <nav className="space-y-4">
                {navigationItems.map((item, index) => (
                  <div key={index}>
                    <NavLink
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#008246]/5 hover:text-[#008246] transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon && React.createElement(item.icon, { size: 20, className: "text-[#008246]" })}
                      <span className="font-medium">{item.name}</span>
                    </NavLink>

                    {/* Mobile Dropdown Items */}
                    {item.dropdown && (
                      <div className="ml-8 space-y-2">
                        {item.dropdown.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => {
                              if (subItem.type) {
                                handleLeadFormOpen(subItem.type);
                              } else {
                                navigate(subItem.href);
                                setIsMenuOpen(false);
                              }
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-[#008246] transition-colors"
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Auth */}
                {!loading && currentUser ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="px-4 py-2 rounded-xl border text-gray-700">
                      <span className="block font-bold">{currentUser.name}</span>
                      <span className="block text-xs text-gray-500">{currentUser.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate(getDashboardRoute());
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-[#f7da5e]/30 transition text-[#008246] font-semibold"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition"
                    >
                      <FiLogOut className="h-5 w-5" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 flex gap-2">
                    <button
                      onClick={() => {
                        navigate('/login')
                      }}
                      className="w-full px-4 py-2 bg-[#008246] text-white rounded-lg font-semibold hover:bg-[#009c55] transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signup')
                      }}
                      className="w-full px-4 py-2 border-2 border-[#008246] text-[#008246] rounded-lg font-semibold hover:bg-[#008246]/10 transition-all"
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {/* Mobile Contact Info */}
                <div className="pt-6 space-y-3 text-sm text-gray-600">
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

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={showLeadModal}
        onClose={handleLeadFormClose}
        projectType={selectedProjectType}
      />
    </>
  );
};

export default Header;
