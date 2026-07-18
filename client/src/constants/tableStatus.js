export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
};

export const TABLE_STATUS_LABELS = {
  [TABLE_STATUS.AVAILABLE]: 'Available',
  [TABLE_STATUS.OCCUPIED]: 'Occupied',
  [TABLE_STATUS.RESERVED]: 'Reserved',
};

export const TABLE_STATUS_COLORS = {
  [TABLE_STATUS.AVAILABLE]: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
  [TABLE_STATUS.OCCUPIED]: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
  [TABLE_STATUS.RESERVED]: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
};
