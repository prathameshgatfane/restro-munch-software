export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_TOKEN: '/auth/verify-token',
  },
  ORDERS: {
    BASE: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    SETTLE: (id) => `/orders/${id}/settle`,
    MOVE: (id) => `/orders/${id}/move`,
    SPLIT: (id) => `/orders/${id}/split`,
  },
  MENU: {
    CATEGORIES: '/menu/categories',
    ITEMS: '/menu/items',
    ITEM_DETAIL: (id) => `/menu/items/${id}`,
    BULK_UPLOAD: '/menu/items/bulk-upload',
  },
  INVENTORY: {
    BASE: '/inventory/materials',
    RECIPES: '/inventory/recipes',
    ALERTS: '/inventory/low-stock-alerts',
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id) => `/users/${id}`,
  },
  SETTINGS: {
    GENERAL: '/settings/general',
    TAXES: '/settings/taxes',
    INTEGRATIONS: '/settings/integrations',
  },
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    FOOD_COST: '/reports/food-cost',
  },
};
