/**
 * Mock Auth Service Layer
 * Authenticates users and resolves tenant context & subscription status
 */

import { getStoredUsers } from './staffService';
import { getStoredTenants } from './tenantService';
import { ROLES } from '../../constants/roles';

export const authService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email) {
          reject(new Error('Email is required'));
          return;
        }

        const users = getStoredUsers();
        const cleanEmail = email.toLowerCase().trim();

        // 1. Check exact email match
        let foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

        // 2. If no exact match, fallback to keyword detection for demo ease
        if (!foundUser) {
          let role = ROLES.ADMIN;
          if (cleanEmail.includes('super')) role = ROLES.SUPER_ADMIN;
          else if (cleanEmail.includes('cashier')) role = ROLES.CASHIER;
          else if (cleanEmail.includes('manager')) role = ROLES.MANAGER;
          else if (cleanEmail.includes('kitchen')) role = ROLES.KITCHEN;

          const isSuper = role === ROLES.SUPER_ADMIN;
          foundUser = {
            id: `u_${Date.now()}`,
            name: email.split('@')[0].toUpperCase(),
            email,
            role,
            restaurantId: isSuper ? null : 'restro_1',
            restaurantName: isSuper ? 'SaaS Platform Control' : 'Royal Dhaba',
            status: 'Active'
          };
        }

        // 3. Super Admin bypasses subscription check
        if (foundUser.role === ROLES.SUPER_ADMIN) {
          resolve({
            user: {
              ...foundUser,
              subscriptionPlan: 'Enterprise Platform',
              subscriptionStatus: 'Active'
            },
            tokens: {
              access: `mock_jwt_super_${Date.now()}`,
              refresh: `mock_jwt_refresh_super_${Date.now()}`
            }
          });
          return;
        }

        // 4. Resolve restaurant tenant details
        const tenants = getStoredTenants();
        const tenant = tenants.find((t) => t.id === foundUser.restaurantId) || tenants[0];

        const subscriptionPlan = tenant?.subscription?.plan || 'Basic';
        const subscriptionStatus = tenant?.subscription?.status || 'Active';

        resolve({
          user: {
            ...foundUser,
            restaurantId: tenant.id,
            restaurantName: tenant.name,
            subscriptionPlan,
            subscriptionStatus
          },
          tokens: {
            access: `mock_jwt_${foundUser.id}_${Date.now()}`,
            refresh: `mock_jwt_refresh_${foundUser.id}_${Date.now()}`
          }
        });
      }, 300);
    });
  }
};

export default authService;
