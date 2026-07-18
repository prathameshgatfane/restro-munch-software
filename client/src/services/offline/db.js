import Dexie from 'dexie';

export const db = new Dexie('RestroMunchDB');

// Define database schema
db.version(1).stores({
  orders: 'id, created_at, synced, status, tableId',
  tables: 'id, status, outlet_id',
  bills: 'id, order_id, synced, created_at',
  inventory: 'id, name, currentStock, reorderLevel',
  users: 'id, email, role',
  settings: 'key, value', // Cache General, Tax and Integrations config
});

// Helper wrappers
export const saveOrderLocal = async (order) => {
  return await db.orders.put({
    ...order,
    synced: order.synced ?? false,
  });
};

export const getOrderLocal = async (id) => {
  return await db.orders.get(id);
};

export const getUnsyncedOrders = async () => {
  return await db.orders.where('synced').equals(0).toArray(); // using 0 for false in IndexedDB indexes
};

export const saveBillLocal = async (bill) => {
  return await db.bills.put({
    ...bill,
    synced: bill.synced ?? false,
  });
};

export const getUnsyncedBills = async () => {
  return await db.bills.where('synced').equals(0).toArray();
};

export const cacheTablesLocal = async (tables) => {
  return await db.transaction('rw', db.tables, async () => {
    await db.tables.clear();
    await db.tables.bulkPut(tables);
  });
};

export const getTablesLocal = async () => {
  return await db.tables.toArray();
};
