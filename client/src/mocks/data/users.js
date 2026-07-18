import { ROLES } from '../../constants/roles';

export const MOCK_USERS = [
  { id: 'u_1', name: 'Admin User', email: 'admin@restro.com', role: ROLES.ADMIN, outletId: 'out_1' },
  { id: 'u_2', name: 'Cashier User', email: 'cashier@restro.com', role: ROLES.CASHIER, outletId: 'out_1' },
  { id: 'u_3', name: 'Kitchen Staff', email: 'kitchen@restro.com', role: ROLES.KITCHEN, outletId: 'out_1' },
  { id: 'u_4', name: 'Manager User', email: 'manager@restro.com', role: ROLES.MANAGER, outletId: 'out_1' },
];
export default MOCK_USERS;
