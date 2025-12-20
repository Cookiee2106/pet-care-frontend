import React from 'react'
import { useLocation, Outlet, Navigate } from 'react-router-dom';

import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles = [], useOutlet = false }) => {
  const token = localStorage.getItem("authToken");
  const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];
  const location = useLocation();

  if (!token) {
    // Redirect to login and remember the last location
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRoles");
      return <Navigate to='/login' state={{ from: location }} replace />;
    }
  } catch (error) {
    // If token is invalid (e.g. malformed), clear it and redirect
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRoles");
    return <Navigate to='/login' state={{ from: location }} replace />;
  }


  const userRolesLower = userRoles.map((role) => role.toLowerCase());
  const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());

  const isAuthorized = userRolesLower.some((userRole) =>
    allowedRolesLower.includes(userRole)
  );


  if (isAuthorized) {
    // Optionally render children or an Outlet based on useOutlet flag
    return useOutlet ? <Outlet /> : children;
  } else {
    // Redirect to a default or unauthorized access page if the user doesn't have an allowed role
    return <Navigate to='/unauthorized' state={{ from: location }} replace />;
  }

};

export default ProtectedRoute
