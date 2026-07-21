/**
 * Mock Staff Service Layer
 * Manages restaurant staff user accounts, role assignments, and credentials
 */

import { generateTempPassword } from './tenantService';
import { ROLES } from '../../constants/roles';

const STORAGE_KEY_USERS = 'rm_users';

const INITIAL_USERS = [
  {
    id: 'u_super',
    name: 'Platform Super Admin',
    email: 'super@restromunch.com',
    role: ROLES.SUPER_ADMIN,
    restaurantId: null,
    restaurantName: 'SaaS Platform Control',
    phone: '9999999999',
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: 'Just now'
  },
  {
    id: 'u_admin1',
    name: 'Rahul Sharma',
    email: 'owner@royaldhaba.com',
    role: ROLES.ADMIN,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543210',
    status: 'Active',
    createdAt: '2026-01-15T10:00:00.000Z',
    lastLogin: '2 hours ago'
  },
  {
    id: 'u_admin2',
    name: 'Anita Roy',
    email: 'anita@pizzahub.com',
    role: ROLES.ADMIN,
    restaurantId: 'restro_2',
    restaurantName: 'Pizza Hub & Cafe',
    phone: '9123456789',
    status: 'Active',
    createdAt: '2026-02-01T11:30:00.000Z',
    lastLogin: '1 day ago'
  },
  {
    id: 'u_1',
    name: 'Admin User',
    email: 'admin@restro.com',
    role: ROLES.ADMIN,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543210',
    status: 'Active',
    createdAt: '2026-01-15T10:00:00.000Z',
    lastLogin: 'Just now'
  },
  {
    id: 'u_2',
    name: 'Priya Cashier',
    email: 'cashier@restro.com',
    role: ROLES.CASHIER,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543211',
    status: 'Active',
    createdAt: '2026-01-16T12:00:00.000Z',
    lastLogin: '3 hours ago'
  },
  {
    id: 'u_3',
    name: 'Chef Ramesh',
    email: 'kitchen@restro.com',
    role: ROLES.KITCHEN,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543212',
    status: 'Active',
    createdAt: '2026-01-16T12:30:00.000Z',
    lastLogin: '1 hour ago'
  },
  {
    id: 'u_4',
    name: 'Suresh Manager',
    email: 'manager@restro.com',
    role: ROLES.MANAGER,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543213',
    status: 'Active',
    createdAt: '2026-01-16T13:00:00.000Z',
    lastLogin: 'Yesterday'
  }
];

export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error loading users from localStorage:', err);
  }
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
};

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users:', err);
  }
};

export const addMockUser = (user) => {
  const users = getStoredUsers();
  users.unshift(user);
  saveStoredUsers(users);
};

export const staffService = {
  // Get staff for a specific restaurant or all staff if super_admin
  async getStaff(restaurantId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getStoredUsers();
        if (!restaurantId) {
          resolve(users);
        } else {
          resolve(users.filter((u) => u.restaurantId === restaurantId));
        }
      }, 150);
    });
  },

  // Create staff user account with generated temporary password
  async createStaff(userData, creatorRestaurantId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!userData.name || !userData.email || !userData.role) {
          reject(new Error('Name, email, and role are required!'));
          return;
        }

        const users = getStoredUsers();
        const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
        if (existing) {
          reject(new Error('A user with this email address already exists!'));
          return;
        }

        const tempPassword = generateTempPassword(userData.name);
        const newUser = {
          id: `u_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          restaurantId: creatorRestaurantId || 'restro_1',
          restaurantName: userData.restaurantName || 'Restaurant',
          phone: userData.phone || 'N/A',
          tempPassword,
          status: 'Active',
          createdAt: new Date().toISOString(),
          lastLogin: 'Never'
        };

        const updatedUsers = [newUser, ...users];
        saveStoredUsers(updatedUsers);

        resolve({
          user: newUser,
          credentials: {
            email: userData.email,
            tempPassword,
            role: userData.role
          }
        });
      }, 250);
    });
  },

  // Update staff user
  async updateStaff(userId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredUsers();
        const index = users.findIndex((u) => u.id === userId);
        if (index === -1) {
          reject(new Error('Staff user not found'));
          return;
        }

        users[index] = { ...users[index], ...updates };
        saveStoredUsers(users);
        resolve(users[index]);
      }, 200);
    });
  },

  // Delete staff user
  async deleteStaff(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredUsers();
        const filtered = users.filter((u) => u.id !== userId);
        saveStoredUsers(filtered);
        resolve(true);
      }, 200);
    });
  }
};

export default staffService;
