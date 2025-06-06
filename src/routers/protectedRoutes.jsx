import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// allowedRoles = ['admin', 'user', 'staff']
const ProtectedRoute = ({ children, allowedRoles = [], adminOnly = false }) => {
  const { currentUser: user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin only route
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to={getRoleBasedDashboard(user.role)} replace />;
  }

  // Role-specific route protection
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleBasedDashboard(user.role)} replace />;
  }

  return children;
};

// Role-based dashboard redirects
const getRoleBasedDashboard = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'staff':
      return '/staff/dashboard';
    case 'user':
    default:
      return '/user/dashboard';
  }
};

export default ProtectedRoute;
