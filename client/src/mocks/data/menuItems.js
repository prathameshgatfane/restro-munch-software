export const MOCK_CATEGORIES = [
  { id: 'cat_1', name: 'Starters', slug: 'starters' },
  { id: 'cat_2', name: 'Main Course', slug: 'main-course' },
  { id: 'cat_3', name: 'Breads', slug: 'breads' },
  { id: 'cat_4', name: 'Beverages', slug: 'beverages' },
];

export const MOCK_MENU_ITEMS = [
  { id: 'item_1', categoryId: 'cat_1', name: 'Paneer Tikka', price: 240, code: 'PT', isVeg: true, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&auto=format&fit=crop&q=80' },
  { id: 'item_2', categoryId: 'cat_1', name: 'Veg Hara Bhara Kabab', price: 180, code: 'HBK', isVeg: true, image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=300&auto=format&fit=crop&q=80' },
  { id: 'item_3', categoryId: 'cat_1', name: 'Chicken Seekh Kebab', price: 290, code: 'CSK', isVeg: false, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&auto=format&fit=crop&q=80' },
  
  { id: 'item_4', categoryId: 'cat_2', name: 'Dal Makhani', price: 190, code: 'DM', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80' },
  { id: 'item_5', categoryId: 'cat_2', name: 'Paneer Butter Masala', price: 260, code: 'PBM', isVeg: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80' },
  { id: 'item_6', categoryId: 'cat_2', name: 'Kadai Chicken', price: 320, code: 'KC', isVeg: false, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&auto=format&fit=crop&q=80' },
  
  { id: 'item_7', categoryId: 'cat_3', name: 'Tandoori Roti', price: 15, code: 'TR', isVeg: true, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&auto=format&fit=crop&q=80' },
  { id: 'item_8', categoryId: 'cat_3', name: 'Butter Naan', price: 40, code: 'BN', isVeg: true, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&auto=format&fit=crop&q=80' },
  { id: 'item_9', categoryId: 'cat_3', name: 'Garlic Naan', price: 55, code: 'GN', isVeg: true, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&auto=format&fit=crop&q=80' },
  
  { id: 'item_10', categoryId: 'cat_4', name: 'Masala Chaas', price: 30, code: 'MC', isVeg: true, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&auto=format&fit=crop&q=80' },
  { id: 'item_11', categoryId: 'cat_4', name: 'Sweet Lassi', price: 50, code: 'SL', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop&q=80' },
  { id: 'item_12', categoryId: 'cat_4', name: 'Mineral Water', price: 20, code: 'MW', isVeg: true, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&auto=format&fit=crop&q=80' },
];
