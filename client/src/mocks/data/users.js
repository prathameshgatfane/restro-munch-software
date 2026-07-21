import { ROLES } from '../../constants/roles';

export const MOCK_USERS = [
  {
    id: 'u_super',
    name: 'Platform Super Admin',
    email: 'super@restromunch.com',
    role: ROLES.SUPER_ADMIN,
    restaurantId: null,
    restaurantName: 'SaaS Platform Control',
    phone: '9999999999',
    status: 'Active'
  },
  {
    id: 'u_admin1',
    name: 'Rahul Sharma',
    email: 'owner@royaldhaba.com',
    role: ROLES.ADMIN,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543210',
    status: 'Active'
  },
  {
    id: 'u_admin2',
    name: 'Anita Roy',
    email: 'anita@pizzahub.com',
    role: ROLES.ADMIN,
    restaurantId: 'restro_2',
    restaurantName: 'Pizza Hub & Cafe',
    phone: '9123456789',
    status: 'Active'
  },
  {
    id: 'u_1',
    name: 'Admin User',
    email: 'admin@restro.com',
    role: ROLES.ADMIN,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543210',
    status: 'Active'
  },
  {
    id: 'u_2',
    name: 'Priya Cashier',
    email: 'cashier@restro.com',
    role: ROLES.CASHIER,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543211',
    status: 'Active'
  },
  {
    id: 'u_3',
    name: 'Chef Ramesh',
    email: 'kitchen@restro.com',
    role: ROLES.KITCHEN,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543212',
    status: 'Active'
  },
  {
    id: 'u_4',
    name: 'Suresh Manager',
    email: 'manager@restro.com',
    role: ROLES.MANAGER,
    restaurantId: 'restro_1',
    restaurantName: 'Royal Dhaba',
    phone: '9876543213',
    status: 'Active'
  }
];

export default MOCK_USERS;
