// src/routers/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import NotFound from '../pages/NotFound';

// Usage: <ProtectedRoute allowedRoles={['admin','user']} />
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser: user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // Go to login, but remember current page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard if wrong role
    return <Navigate to={getRoleBasedDashboard(user.role)} replace />;
  }

  return children;
};

// Role-based dashboard redirects
const getRoleBasedDashboard = (role) => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'staff':
      return '/dashboard/staff';
    case 'user':
    default:
      return '/dashboard/user';
  }
};

export default ProtectedRoute;
