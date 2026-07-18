import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tables: [],
  selectedTableId: null,
  categories: [],
  menuItems: [],
  cart: {}, // Format: { [tableId]: [ { id, name, price, qty, notes } ] }
  lowStockAlerts: [],
  isLoading: false,
  error: null,
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setTables(state, action) {
      state.tables = action.payload;
    },
    updateTable(state, action) {
      const updatedTable = action.payload;
      const index = state.tables.findIndex((t) => t.id === updatedTable.id);
      if (index !== -1) {
        state.tables[index] = { ...state.tables[index], ...updatedTable };
      } else {
        state.tables.push(updatedTable);
      }
    },
    setSelectedTableId(state, action) {
      state.selectedTableId = action.payload;
    },
    setMenuData(state, action) {
      const { categories, items } = action.payload;
      state.categories = categories;
      state.menuItems = items;
    },
    addToCart(state, action) {
      const { tableId, item } = action.payload;
      if (!state.cart[tableId]) {
        state.cart[tableId] = [];
      }
      
      const existingItem = state.cart[tableId].find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.cart[tableId].push({ ...item, qty: 1, notes: '' });
      }
    },
    removeFromCart(state, action) {
      const { tableId, itemId } = action.payload;
      if (state.cart[tableId]) {
        state.cart[tableId] = state.cart[tableId].filter((i) => i.id !== itemId);
      }
    },
    updateCartItemQty(state, action) {
      const { tableId, itemId, qty } = action.payload;
      if (state.cart[tableId]) {
        const item = state.cart[tableId].find((i) => i.id === itemId);
        if (item) {
          item.qty = Math.max(1, qty);
        }
      }
    },
    updateCartItemNotes(state, action) {
      const { tableId, itemId, notes } = action.payload;
      if (state.cart[tableId]) {
        const item = state.cart[tableId].find((i) => i.id === itemId);
        if (item) {
          item.notes = notes;
        }
      }
    },
    clearCart(state, action) {
      const tableId = action.payload;
      delete state.cart[tableId];
    },
    moveCart(state, action) {
      const { sourceTableId, targetTableId } = action.payload;
      state.cart[targetTableId] = state.cart[sourceTableId] || [];
      delete state.cart[sourceTableId];
    },
    mergeCarts(state, action) {
      const { sourceTableIds, targetTableId } = action.payload;
      if (!state.cart[targetTableId]) {
        state.cart[targetTableId] = [];
      }
      sourceTableIds.forEach(sourceId => {
        const sourceCart = state.cart[sourceId] || [];
        sourceCart.forEach(sourceItem => {
          const existingItem = state.cart[targetTableId].find(i => i.id === sourceItem.id);
          if (existingItem) {
            existingItem.qty += sourceItem.qty;
          } else {
            state.cart[targetTableId].push({ ...sourceItem });
          }
        });
        delete state.cart[sourceId];
      });
    },
    setLowStockAlerts(state, action) {
      state.lowStockAlerts = action.payload;
    },
    addLowStockAlert(state, action) {
      const alert = action.payload;
      if (!state.lowStockAlerts.some((a) => a.id === alert.id)) {
        state.lowStockAlerts.push(alert);
      }
    },
    removeLowStockAlert(state, action) {
      const alertId = action.payload;
      state.lowStockAlerts = state.lowStockAlerts.filter((a) => a.id !== alertId);
    },
  },
});

export const {
  setLoading,
  setTables,
  updateTable,
  setSelectedTableId,
  setMenuData,
  addToCart,
  removeFromCart,
  updateCartItemQty,
  updateCartItemNotes,
  clearCart,
  moveCart,
  mergeCarts,
  setLowStockAlerts,
  addLowStockAlert,
  removeLowStockAlert,
} = posSlice.actions;

export default posSlice.reducer;
