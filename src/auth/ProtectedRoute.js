import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getuser_type } from './token';

const ProtectedRoute = ({ component: Component, requireduser_type, ...rest }) => {
  const token = getToken();
  const user_type = getuser_type();

  console.log('ProtectedRoute: token:', token);
  console.log('ProtectedRoute: user_type:', user_type);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireduser_type && user_type !== requireduser_type) {
    return <Navigate to="/signup" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;