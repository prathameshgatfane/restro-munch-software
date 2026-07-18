import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import posReducer from '../features/pos/slices/posSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pos: posReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Turn off for simpler custom timestamps in IndexedDB mappings
    }),
});

export default store;
