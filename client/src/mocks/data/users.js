import { ROLES } from '../../constants/roles';

export const MOCK_USERS = [
  { id: 'u_1', name: 'Admin User', email: 'admin@restro.com', role: ROLES.ADMIN, restaurantId: 'restro_1' },
  { id: 'u_2', name: 'Cashier User', email: 'cashier@restro.com', role: ROLES.CASHIER, restaurantId: 'restro_1' },
  { id: 'u_3', name: 'Kitchen Staff', email: 'kitchen@restro.com', role: ROLES.KITCHEN, restaurantId: 'restro_1' },
  { id: 'u_4', name: 'Manager User', email: 'manager@restro.com', role: ROLES.MANAGER, restaurantId: 'restro_1' },
];
export default MOCK_USERS;
