import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, allowGuest = false }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const guestData = location.state?.guestCheckout;

  // Handle guest access first
  if (allowGuest) {
    if (token) {
      // Regular user - check roles
      if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
      }
      return children;
    }

    // Guest user - check for guest data
    if (guestData) {
      return children;
    }

    // No guest data - redirect to form
    return <Navigate to="/" replace />;
  }

  // Regular protected route (non-guest)
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{
          protectedPath: location.pathname,  // Current path user tried to access
          from: location,                   // Original location
          guestCheckout: guestData           // Preserve guest data if exists
        }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
