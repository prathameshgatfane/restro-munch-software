import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Role-Based Access Control route guard wrapper.
 * @param {object} props
 * @param {Array<string>} props.roles - Allowed user roles
 */
export const RoleBasedRoute = ({ roles = [] }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !roles.includes(user.role)) {
    // If not allowed, redirect to Dashboard home
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
