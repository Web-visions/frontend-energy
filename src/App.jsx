import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import {
  Home,
  Payment,
  ProductPage,
  AddtoCartPage,
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

// Dashboard Pages
import DashboardLayout from './layout/dashboard-layout';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import StaffDashboard from './pages/dashboard/StaffDashboard';
import UserProfile from './pages/dashboard/UserProfile';
import UserManagement from './pages/dashboard/UserManagement';
import Settings from './pages/dashboard/Settings';

import ProtectedRoute from './routers/protectedRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<><Header /><Home /><Footer /></>} />
          <Route path="/products" element={<><Header /><ProductPage /><Footer /></>} />
          <Route path="/cart" element={<><Header /><AddtoCartPage /><Footer /></>} />
          <Route path="/payment" element={<><Header /><Payment /><Footer /></>} />
          <Route path="/login" element={<><Header /><Login /><Footer /></>} />
          <Route path="/signup" element={<><Header /><Signup /><Footer /></>} />
          <Route path="/services" element={<><Header /><Services /><Footer /></>} />
          <Route path="/help" element={<><Header /><Help /><Footer /></>} />
          <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />

          {/* --- Auth-related --- */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

          {/* =================== Protected Dashboard Routes =================== */}

          {/* ------ ADMIN ------ */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <UserProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/brands"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  {/* Your Brands component here */}
                  {/* <Brands /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/cities"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  {/* Your Cities component here */}
                  {/* <Cities /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/repair-orders"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  {/* Your Repair Orders component here */}
                  {/* <RepairOrders /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/orders"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  {/* Your Orders component here */}
                  {/* <Orders /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/banner"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  {/* Your Banner component here */}
                  {/* <Banner /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/inventory"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  {/* Your Inventory component here */}
                  {/* <Inventory /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ------ STAFF ------ */}
          <Route
            path="/dashboard/staff"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <DashboardLayout>
                  <StaffDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staff/profile"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <DashboardLayout>
                  <UserProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staff/repair-orders"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <DashboardLayout>
                  {/* <RepairOrders /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staff/orders"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <DashboardLayout>
                  {/* <Orders /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ------ USER ------ */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout>
                  <UserDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/profile"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout>
                  <UserProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/repair-orders"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout>
                  {/* <RepairOrders /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/orders"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout>
                  {/* <Orders /> */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/settings"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
