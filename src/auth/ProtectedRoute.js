import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserType } from './token';

const ProtectedRoute = ({ component: Component, requiredUserType, ...rest }) => {
  const token = getToken();
  const userType = getUserType();

  console.log('ProtectedRoute: token:', token);
  console.log('ProtectedRoute: userType:', userType);

  // Check if token is not found
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Check if user type matches the required user type
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/signup" />;
  }

  // Render the protected component if all checks pass
  return <Component {...rest} />;
};

export default ProtectedRoute;