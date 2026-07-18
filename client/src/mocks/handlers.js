import { http, HttpResponse } from 'msw';
import { MOCK_USERS } from './data/users';
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from './data/menuItems';
import { MOCK_TABLES } from './data/tables';
import { MOCK_ORDERS } from './data/orders';
import { MOCK_INVENTORY } from './data/inventory';

export const handlers = [
  // Auth API Mocks
  http.post('*/auth/login', async ({ request }) => {
    try {
      const { email } = await request.json();
      const user = MOCK_USERS.find((u) => u.email === email) || MOCK_USERS[0];
      
      return HttpResponse.json({
        success: true,
        data: {
          user,
          tokens: {
            access: `mock_access_token_${user.role}`,
            refresh: 'mock_refresh_token',
          },
        },
      });
    } catch {


      return HttpResponse.json(
        { success: false, message: 'Invalid payload' },
        { status: 400 }
      );
    }
  }),

  http.post('*/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.post('*/auth/refresh-token', () => {
    return HttpResponse.json({
      success: true,
      data: {
        tokens: {
          access: 'mock_refreshed_access_token',
          refresh: 'mock_refresh_token',
        },
      },
    });
  }),

  // Menu Catalog Mocks
  http.get('*/menu/items', () => {
    return HttpResponse.json({
      success: true,
      data: MOCK_MENU_ITEMS,
    });
  }),

  http.get('*/menu/categories', () => {
    return HttpResponse.json({
      success: true,
      data: MOCK_CATEGORIES,
    });
  }),

  // Tables Grid Mocks
  http.get('*/tables', () => {
    return HttpResponse.json({
      success: true,
      data: MOCK_TABLES,
    });
  }),

  // Active Orders Mocks
  http.get('*/orders', () => {
    return HttpResponse.json({
      success: true,
      data: MOCK_ORDERS,
    });
  }),

  http.post('*/orders', async ({ request }) => {
    const orderData = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        id: `ord_${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'new',
        ...orderData,
        created_at: new Date().toISOString(),
      },
    });
  }),

  // Raw Materials Mocks
  http.get('*/inventory/materials', () => {
    return HttpResponse.json({
      success: true,
      data: MOCK_INVENTORY,
    });
  }),
];
