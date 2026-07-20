import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import posReducer from '../features/pos/slices/posSlice';
import restaurantsReducer from '../features/admin/users/slices/restaurantsSlice';
import ordersReducer from '../features/kitchen/slices/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pos: posReducer,
    restaurants: restaurantsReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Turn off for simpler custom timestamps in IndexedDB mappings
    }),
});

export default store;
