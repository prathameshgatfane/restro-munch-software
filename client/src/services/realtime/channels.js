export const SOCKET_CHANNELS = {
  // Rooms
  JOIN_OUTLET: 'join-outlet',
  LEAVE_OUTLET: 'leave-outlet',

  // Outbound updates (cashier -> server)
  UPDATE_TABLE: 'table:update',
  NEW_ORDER: 'order:new',
  UPDATE_ORDER: 'order:update',
  KITCHEN_DONE: 'kitchen:done',

  // Inbound broadcasts (server -> all cashier terminals/KDS)
  TABLE_UPDATED: 'table:updated',
  ORDER_UPDATED: 'order:updated',
  KITCHEN_QUEUED: 'kitchen:queued',
  INVENTORY_LOW: 'inventory:low',
};
export default SOCKET_CHANNELS;
