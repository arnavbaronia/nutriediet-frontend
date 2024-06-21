import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserType } from './token';

const ProtectedRoute = ({ component: Component, requiredUserType, ...rest }) => {
  const token = getToken();
  const userType = getUserType();

  console.log('ProtectedRoute: token:', token);
  console.log('ProtectedRoute: userType:', userType);

  if (!token) {
    // No token found, redirect to login page
    return <Navigate to="/login" />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/signup" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
