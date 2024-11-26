import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, isAdmin }) => {
  return isAdmin ? children : <Navigate to="/" />; // Redirect to login if not admin
};
