export const ORDER_STATUS = {
  NEW: 'new',
  COOKING: 'cooking',
  READY: 'ready',
  SERVED: 'served',
  SETTLED: 'settled',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.NEW]: 'New',
  [ORDER_STATUS.COOKING]: 'Cooking',
  [ORDER_STATUS.READY]: 'Ready',
  [ORDER_STATUS.SERVED]: 'Served',
  [ORDER_STATUS.SETTLED]: 'Settled',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.NEW]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ORDER_STATUS.COOKING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ORDER_STATUS.READY]: 'bg-green-100 text-green-800 border-green-200',
  [ORDER_STATUS.SERVED]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ORDER_STATUS.SETTLED]: 'bg-gray-100 text-gray-800 border-gray-200',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
};
