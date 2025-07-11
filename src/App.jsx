import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import {
  Home,
  Payment,
  CartPage,
  ProductListing,
  Contact,
  Help,
  Login,
  Services,
  Signup,
} from './pages';

import { Header, Footer } from './Components';
import WhatsAppButton from './Components/WhatsAppButton';
import GoogleRatingBadge from './Components/GoogleRatingBadge';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderFailurePage from './pages/OrderFailurePage';
import About from './pages/About';
import Sitemap from './pages/Sitemap';

// Dashboard
import DashboardLayout from './layout/dashboard-layout';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import StaffDashboard from './pages/dashboard/StaffDashboard';
import UserProfile from './pages/dashboard/UserProfile';
import UserManagement from './pages/dashboard/UserManagement';
import BrandManagement from './pages/dashboard/BrandManagement';
import CityManagement from './pages/dashboard/CityManagement';
import CategoryManagement from './pages/dashboard/CategoryManagement';
import LeadManagement from './pages/dashboard/LeadManagement';
import OrderManagement from './pages/dashboard/OrderManagement';
import Settings from './pages/dashboard/Settings';

import ProtectedRoute from './routers/protectedRoutes';
import InverterManagement from './pages/dashboard/InverterManagement';
import BatteryManagement from './pages/dashboard/BatteryManagement';
import UPSManagement from './pages/dashboard/UpsManagement';
import SolarStreetLightManagement from './pages/dashboard/SolarStreetLightManagement';
import SolarPCUManagement from './pages/dashboard/SolarPCUManagement';
import SolarPVModuleManagement from './pages/dashboard/SolarPVModuleManagement';
import ProductDetails from './pages/ProductDetail';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import BulkOrderManagement from './pages/dashboard/BulkOrderManagement';
import BulkOrderPage from './pages/BulkOrderPage';
import PrivacyTermsPage from './pages/TermsAndConditions';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<><Header /><Home /><Footer /></>} />
            <Route path="/products" element={<><Header /><ProductListing /><Footer /></>} />
            <Route path="/product/:type/:id" element={<><Header /><ProductDetails /><Footer /></>} />
            <Route path="/cart" element={<><Header /><CartPage /><Footer /></>} />
            <Route path="/checkout" element={<><Header /><CheckoutPage /><Footer /></>} />
            <Route path="/order-success" element={<><Header /><OrderSuccessPage /><Footer /></>} />
            <Route path="/order-failure" element={<><Header /><OrderFailurePage /><Footer /></>} />
            <Route path="/payment" element={<><Header /><Payment /><Footer /></>} />
            <Route path="/login" element={<><Header /><Login /><Footer /></>} />
            <Route path="/signup" element={<><Header /><Signup /><Footer /></>} />
            <Route path="/services" element={<><Header /><Services /><Footer /></>} />
            <Route path="/help" element={<><Header /><Help /><Footer /></>} />
            <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
            <Route path="/faq" element={<><Header /><FAQ /><Footer /></>} />
            <Route path="/about" element={<><Header /><About /><Footer /></>} />
            <Route path="/terms" element={<><Header /><PrivacyTermsPage /><Footer /></>} />

            <Route path="/bulk-orders" element={<><Header /><BulkOrderPage /><Footer /></>} />

            <Route path="/sitemap" element={<><Header /><Sitemap /><Footer /></>} />

            <Route path="/*" element={<><Header /><NotFound /><Footer /></>} />
            {/* Auth-related */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

            {/* ========== DASHBOARD LAYOUT & NESTED ROUTES ========== */}
            <Route
              path="/dashboard/:role"
              element={
                <ProtectedRoute allowedRoles={['admin', 'user', 'staff']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Route: /dashboard/admin, /dashboard/staff, /dashboard/user */}
              <Route
                index
                element={
                  <DashboardRoleHome />
                }
              />
              <Route path="profile" element={<UserProfile />} />
              {/* Admin-only nested routes */}
              <Route path="users" element={<UserManagement />} />
              <Route path="brands" element={<BrandManagement />} />
              <Route path="battery" element={<BatteryManagement />} />
              <Route path="inverter" element={<InverterManagement />} />
              <Route path="ups" element={<UPSManagement />} />
              <Route path="solar/street-light" element={<SolarStreetLightManagement />} />
              <Route path="solar/pcu" element={<SolarPCUManagement />} />
              <Route path="solar/pv-module" element={<SolarPVModuleManagement />} />
              <Route path="cities" element={<CityManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="lead" element={<LeadManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              {/* <Route path="repair-orders" element={<div>Repair Orders Page</div>} /> */}
              <Route path="bulk-orders" element={<BulkOrderManagement />} />
            </Route>
          </Routes>
          {/* WhatsApp Floating Button */}
          <WhatsAppButton />
          <GoogleRatingBadge />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

/**
 * DashboardRoleHome: Handles the dashboard home page for each role.
 * You can customize this component.
 */
function DashboardRoleHome() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  switch (currentUser.role) {
    case 'admin': return <AdminDashboard />;
    case 'staff': return <StaffDashboard />;
    case 'user': return <UserDashboard />;
    default: return <UserDashboard />;
  }
}
