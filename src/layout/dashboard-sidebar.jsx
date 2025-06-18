import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, LayoutDashboard, Users, ShoppingBag, Settings, FileText, BarChart3, MessageSquare, Bell, Shield, Database, Boxes, Smartphone, Headphones, Cpu, ChevronRight, Home, Building, Recycle, Phone, Wrench, Package, Hammer, LogOut, Image, Pin, MapPin, ListOrdered } from 'lucide-react';
import { logo } from '../assets/';
import { useAuth } from '../context/AuthContext';
import LogoutModal from '../Components/LogoutModal';
import { toast } from 'react-hot-toast';
import { SolarPower } from '@mui/icons-material';

const getSidebarSections = (userRole) => {
  const commonSections = [
    {
      title: 'Overview',
      links: [
        {
          title: 'Dashboard',
          path: `/dashboard/${userRole}`,
          icon: <Home className="w-5 h-5" />
        },
        { title: 'Profile', path: `/dashboard/${userRole}/profile`, icon: <Users className="w-5 h-5" /> },
      ]
    },
    {
      title: 'Exit',
      links: [
        {
          title: 'Logout',
          path: '#',
          icon: <LogOut className="w-5 h-5" />,
          onClick: () => window.dispatchEvent(new CustomEvent('showLogoutModal'))
        }
      ]
    }
  ];

  if (userRole === 'admin') {
    return [
      commonSections[0],
      {
        title: 'Management',
        links: [
          { title: 'Users', path: '/dashboard/admin/users', icon: <Users className="w-5 h-5" /> },
          { title: 'Brands', path: '/dashboard/admin/brands', icon: <Building className="w-5 h-5" /> },
          { title: 'Leads', path: '/dashboard/admin/lead', icon: <MessageSquare className="w-5 h-5" /> },
          { title: "Inverter", path: "/dashboard/admin/inverter", icon: <Cpu className='w-5 h-5' /> },
          { title: "Battery", path: "/dashboard/admin/battery", icon: <Building className='w-5 h-5' /> },
          { title: "UPS", path: "/dashboard/admin/ups", icon: <Hammer className='w-5 h-5' /> },
          { title: "Solar Street Light", path: "/dashboard/admin/solar/street-light", icon: <Phone className='w-5 h-5' /> },
          { title: "Solar PCU", path: "/dashboard/admin/solar/pcu", icon: <SolarPower className='w-5 h-5' /> },
          { title: "Solar PV Module", path: "/dashboard/admin/solar/pv-module", icon: <SolarPower className="w-5 h-5" /> },
          { title: 'City', path: '/dashboard/admin/cities', icon: <MapPin className='w-5 h-5' /> },
          { title: 'Categories', path: '/dashboard/admin/categories', icon: <Database className='w-5 h-5' /> },
          { title: 'Orders', path: '/dashboard/admin/orders', icon: <ListOrdered className='w-5 h-5' /> },

        ]
      },

      {
        title: 'Customization',
        links: [
          { title: 'Banner', path: '/dashboard/admin/banner', icon: <Image className='w-5 h-5' /> }
        ]
      },
      {
        title: 'Inventory',
        links: [
          { title: 'Inventory', path: '/dashboard/admin/inventory', icon: <Boxes className='w-5 h-5' /> }
        ]
      },
      commonSections[1]
    ];
  }

  if (userRole === 'staff') {
    return [
      commonSections[0],
      {
        title: 'Orders',
        links: [
          // { title: 'Repair Orders', path: '/dashboard/staff/repair-orders', icon: <ListOrdered className='w-5 h-5' /> },
          { title: 'Orders', path: '/dashboard/staff/orders', icon: <ListOrdered className='w-5 h-5' /> },
        ]
      },
      commonSections[1]
    ];
  }

  if (userRole === 'user') {
    return [
      commonSections[0],
      {
        title: 'My Orders',
        links: [
          // { title: 'Repair Orders', path: '/dashboard/user/repair-orders', icon: <ListOrdered className='w-5 h-5' /> },
          { title: 'Orders', path: '/dashboard/user/orders', icon: <ListOrdered className='w-5 h-5' /> },
        ]
      },
      commonSections[1]
    ];
  }

  // fallback
  return commonSections;
};



function DashboardSidebar({ isOpen, onClose }) {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout, setUser, currentUser: user } = useAuth();
  const navigate = useNavigate();

  const sidebarSections = getSidebarSections(user?.role || 'user');

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('refreshToken');

      setUser(null);

      setShowLogoutModal(false);
      toast.success('Logged out successfully');

      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  React.useEffect(() => {
    const showModal = () => setShowLogoutModal(true);
    window.addEventListener('showLogoutModal', showModal);
    return () => window.removeEventListener('showLogoutModal', showModal);
  }, []);

  return (
    <>
      {/* Mobile backdrop with blur effect */}
      <div
        className={`fixed mb-2 inset-0 z-40 backdrop-blur-sm bg-gray-800/40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-xl transition-all duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="relative h-16 flex items-center justify-between ml-10 px-4 bg-white">
          <NavLink to='/'>
            {/* <Logo  /> */}
            <img src={logo} alt="logo" />

          </NavLink>
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Navigation with custom scrollbar */}
        <nav className="flex-1 overflow-y-auto h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
          <div className="space-y-6 p-2">
            {sidebarSections.map((section, index) => (
              <div key={index} className="relative">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.links.map((link, linkIndex) => (
                    link.onClick ? (
                      <button
                        key={linkIndex}
                        onClick={link.onClick}
                        className="w-full group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-red-600 hover:bg-red-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`transition-transform duration-200 ${hoveredLink === link.path ? 'scale-110' : ''
                            }`}>
                            {link.icon}
                          </div>
                          <span>{link.title}</span>
                        </div>
                      </button>
                    ) : (
                      <NavLink
                        key={linkIndex}
                        to={link.path}
                        className={({ isActive }) =>
                          `group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                            ? 'bg-gradient-to-r from-blue-600/10 to-blue-600/5 text-brand-purple'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`
                        }
                        onMouseEnter={() => setHoveredLink(link.path)}
                        onMouseLeave={() => setHoveredLink(null)}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`transition-transform duration-200 ${hoveredLink === link.path ? 'scale-110' : ''
                            }`}>
                            {link.icon}
                          </div>
                          <span>{link.title}</span>
                        </div>
                      </NavLink>
                    )
                  ))}
                </div>
                {index < sidebarSections.length - 1 && (
                  <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer with gradient border and hover effect */}
        <div className="relative border-t border-gray-100 bg-gray-100">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

          {/* Dashboard Info */}
          <div className="p-2">
            <div className="group cursor-pointer rounded-xl bg-gradient-to-r from-blue-50 to-gray-100/50 p-3 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-200/50 transition-transform duration-200 group-hover:scale-110">
                  <Shield className="h-5 w-5 text-brand-purple" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">
                    {user?.role === 'admin' ? 'Admin Console' :
                      user?.role === 'partner' ? 'partner Dashboard' :
                        user?.role === 'telecaller' ? 'Telecaller Portal' : 'Dashboard'}
                  </p>
                  <p className="text-xs text-gray-500">v1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <style jsx global>{`
        /* Custom Scrollbar Styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #E5E7EB;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #D1D5DB;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #E5E7EB transparent;
        }
      `}</style>
    </>
  );
}

export default DashboardSidebar;