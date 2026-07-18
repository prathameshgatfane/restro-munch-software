import { ORDER_STATUS } from '../../constants/orderStatus';

export const MOCK_ORDERS = [
  {
    id: 'ord_1021',
    table: '3',
    items: [
      { id: 'item_1', name: 'Paneer Tikka', price: 240, qty: 2, notes: 'Make extra spicy' },
      { id: 'item_8', name: 'Butter Naan', price: 40, qty: 4, notes: '' },
    ],
    status: ORDER_STATUS.COOKING,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(), // 15m ago
  },
  {
    id: 'ord_1022',
    table: '8',
    items: [
      { id: 'item_5', name: 'Paneer Butter Masala', price: 260, qty: 1, notes: '' },
      { id: 'item_7', name: 'Tandoori Roti', price: 15, qty: 3, notes: 'Crispy' },
      { id: 'item_10', name: 'Masala Chaas', price: 30, qty: 2, notes: '' },
    ],
    status: ORDER_STATUS.NEW,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(), // 5m ago
  },
];
export default MOCK_ORDERS;
