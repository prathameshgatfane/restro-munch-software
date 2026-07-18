import { getSocket } from './socketManager';
import SOCKET_CHANNELS from './channels';
import { db } from '../offline/db';

/**
 * Attaches global socket listeners to dispatch Redux actions and update Dexie local DB.
 * @param {Function} dispatch - The Redux store dispatch function
 * @param {object} actions - Object containing POS/Auth actions
 */
export const registerSocketEventHandlers = (dispatch, actions) => {
  const socket = getSocket();
  if (!socket) return;

  // Table updates (e.g. status changes, seats, occupied)
  socket.on(SOCKET_CHANNELS.TABLE_UPDATED, async (tableData) => {
    console.log('Realtime: Table updated event received:', tableData);
    // 1. Update IndexedDB cache
    await db.tables.put(tableData);
    // 2. Dispatch to Redux POS Slice
    if (actions.updateTable) {
      dispatch(actions.updateTable(tableData));
    }
  });

  // Order status/content updates
  socket.on(SOCKET_CHANNELS.ORDER_UPDATED, async (orderData) => {
    console.log('Realtime: Order updated event received:', orderData);
    // 1. Update IndexedDB cache
    await db.orders.put(orderData);
    // 2. Dispatch to Redux
    if (actions.updateOrder) {
      dispatch(actions.updateOrder(orderData));
    }
  });

  // Low stock alerts
  socket.on(SOCKET_CHANNELS.INVENTORY_LOW, async (alertData) => {
    console.log('Realtime: Low stock alert received:', alertData);
    // 1. Update IndexedDB cache
    await db.inventory.put(alertData);
    // 2. Dispatch alert
    if (actions.addLowStockAlert) {
      dispatch(actions.addLowStockAlert(alertData));
    }
  });
};
