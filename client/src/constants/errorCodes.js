export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  OFFLINE_QUEUE_FULL: 'OFFLINE_QUEUE_FULL',
  PRINTER_OFFLINE: 'PRINTER_OFFLINE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection lost. Operations will be queued locally.',
  [ERROR_CODES.UNAUTHORIZED]: 'Session expired. Please log in again.',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ERROR_CODES.NOT_FOUND]: 'Requested resource not found.',
  [ERROR_CODES.SERVER_ERROR]: 'An internal server error occurred. Retrying in background...',
  [ERROR_CODES.OFFLINE_QUEUE_FULL]: 'Offline sync queue is full. Please reconnect to internet.',
  [ERROR_CODES.PRINTER_OFFLINE]: 'Thermal printer is offline. Order ticket queued.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please correct the highlighted fields.',
};
