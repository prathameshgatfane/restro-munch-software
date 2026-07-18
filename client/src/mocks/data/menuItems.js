export const MOCK_CATEGORIES = [
  { id: 'cat_1', name: 'Starters', slug: 'starters' },
  { id: 'cat_2', name: 'Main Course', slug: 'main-course' },
  { id: 'cat_3', name: 'Breads', slug: 'breads' },
  { id: 'cat_4', name: 'Beverages', slug: 'beverages' },
];

export const MOCK_MENU_ITEMS = [
  { id: 'item_1', categoryId: 'cat_1', name: 'Paneer Tikka', price: 240, code: 'PT', isVeg: true },
  { id: 'item_2', categoryId: 'cat_1', name: 'Veg Hara Bhara Kabab', price: 180, code: 'HBK', isVeg: true },
  { id: 'item_3', categoryId: 'cat_1', name: 'Chicken Seekh Kebab', price: 290, code: 'CSK', isVeg: false },
  
  { id: 'item_4', categoryId: 'cat_2', name: 'Dal Makhani', price: 190, code: 'DM', isVeg: true },
  { id: 'item_5', categoryId: 'cat_2', name: 'Paneer Butter Masala', price: 260, code: 'PBM', isVeg: true },
  { id: 'item_6', categoryId: 'cat_2', name: 'Kadai Chicken', price: 320, code: 'KC', isVeg: false },
  
  { id: 'item_7', categoryId: 'cat_3', name: 'Tandoori Roti', price: 15, code: 'TR', isVeg: true },
  { id: 'item_8', categoryId: 'cat_3', name: 'Butter Naan', price: 40, code: 'BN', isVeg: true },
  { id: 'item_9', categoryId: 'cat_3', name: 'Garlic Naan', price: 55, code: 'GN', isVeg: true },
  
  { id: 'item_10', categoryId: 'cat_4', name: 'Masala Chaas', price: 30, code: 'MC', isVeg: true },
  { id: 'item_11', categoryId: 'cat_4', name: 'Sweet Lassi', price: 50, code: 'SL', isVeg: true },
  { id: 'item_12', categoryId: 'cat_4', name: 'Mineral Water', price: 20, code: 'MW', isVeg: true },
];
