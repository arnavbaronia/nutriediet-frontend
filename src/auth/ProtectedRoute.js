// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireduser_type }) => {
  const token = localStorage.getItem('token');
  const user_type = localStorage.getItem('user_type');
  const is_active = localStorage.getItem('is_active') === 'true';
  const location = useLocation();

  // Determine which login page to redirect to based on the route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const loginPath = isAdminRoute ? '/admin/login' : '/login';

  if (!token) {
    return <Navigate to={loginPath} replace />;
  }

  if (requireduser_type && user_type !== requireduser_type) {
    return <Navigate to={loginPath} replace />;
  }

  if (user_type === 'CLIENT' && !is_active) {
    return <Navigate to="/account-activation" replace />;
  }

  return children;
};

export default ProtectedRoute;