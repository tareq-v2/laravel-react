import React from 'react';
import { Navigate } from 'react-router-dom';

// export default function ProtectedRoute({ children }) {
//   const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated
//   return isAuthenticated ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
// }
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;


