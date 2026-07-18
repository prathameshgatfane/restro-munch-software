import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import POSPage from '../features/pos/pages/POSPage';
import KitchenDisplayPage from '../features/kitchen/pages/KitchenDisplayPage';
import MenuManagement from '../features/admin/menu/pages/MenuManagement';
import InventoryPage from '../features/admin/inventory/pages/InventoryPage';
import UsersPage from '../features/admin/users/pages/UsersPage';
import SettingsPage from '../features/admin/settings/pages/SettingsPage';
import ReportsPage from '../features/reports/pages/ReportsPage';

import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ROLES } from '../constants/roles';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes (Wrapped in DashboardLayout) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default route redirects to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard Landing */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* POS Page (Accessible by Admin, Manager, Cashier) */}
        <Route
          element={<RoleBasedRoute roles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER]} />}
        >
          <Route path="/pos" element={<POSPage />} />
        </Route>

        {/* KDS Kitchen Screen (Accessible by Kitchen Staff, Admin) */}
        <Route
          element={<RoleBasedRoute roles={[ROLES.ADMIN, ROLES.KITCHEN]} />}
        >
          <Route path="/kitchen" element={<KitchenDisplayPage />} />
        </Route>

        {/* Admin Menu Catalog Management */}
        <Route
          element={<RoleBasedRoute roles={[ROLES.ADMIN, ROLES.MANAGER]} />}
        >
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/inventory" element={<InventoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Staff Credentials Configuration (Admin Only) */}
        <Route
          element={<RoleBasedRoute roles={[ROLES.ADMIN]} />}
        >
          <Route path="/admin/users" element={<UsersPage />} />
        </Route>
      </Route>

      {/* Wildcard Route redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
