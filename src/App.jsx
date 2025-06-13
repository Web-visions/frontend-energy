import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import {
  Home,
  Payment,
  AddtoCartPage,
  ProductListing,
  Contact,
  Help,
  Login,
  Services,
  Signup,
} from './pages';

import { Header, Footer } from './Components';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
import Settings from './pages/dashboard/Settings';

import ProtectedRoute from './routers/protectedRoutes';
import InverterManagement from './pages/dashboard/InverterManagement';
import BatteryManagement from './pages/dashboard/BatteryManagement';
import UPSManagement from './pages/dashboard/UpsManagement';
import SolarStreetLightManagement from './pages/dashboard/SolarStreetLightManagement';
import SolarPCUManagement from './pages/dashboard/SolarPCUManagement';
import SolarPVModuleManagement from './pages/dashboard/SolarPVModuleManagement';
import ProductDetails from './pages/ProductDetail';

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
            <Route path="/cart" element={<><Header /><AddtoCartPage /><Footer /></>} />
            <Route path="/payment" element={<><Header /><Payment /><Footer /></>} />
            <Route path="/login" element={<><Header /><Login /><Footer /></>} />
            <Route path="/signup" element={<><Header /><Signup /><Footer /></>} />
            <Route path="/services" element={<><Header /><Services /><Footer /></>} />
            <Route path="/help" element={<><Header /><Help /><Footer /></>} />
            <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />

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
              <Route path="repair-orders" element={<div>Repair Orders Page</div>} />
              <Route path="orders" element={<div>Orders Page</div>} />
              <Route path="banner" element={<div>Banner Page</div>} />
              <Route path="inventory" element={<div>Inventory Page</div>} />
              <Route path="settings" element={<Settings />} />
              {/* ...add more nested routes as needed */}
            </Route>
          </Routes>
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
