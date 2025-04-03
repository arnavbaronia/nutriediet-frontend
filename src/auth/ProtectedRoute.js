// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireduser_type }) => {
  const token = localStorage.getItem('token');
  const user_type = localStorage.getItem('user_type');
  const is_active = localStorage.getItem('is_active') === 'true';

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireduser_type && user_type !== requireduser_type) {
    return <Navigate to="/login" />;
  }

  if (user_type === 'CLIENT' && !is_active) {
    return <Navigate to="/account-activation" />;
  }

  return children;
};

export default ProtectedRoute;