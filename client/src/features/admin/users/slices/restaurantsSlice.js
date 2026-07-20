import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tenants: [], // List of restaurant tenants
  activeTenantId: localStorage.getItem('activeTenantId') || null,
  isLoading: false,
  error: null,
};

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setTenants(state, action) {
      state.tenants = action.payload;
    },
    addTenant(state, action) {
      state.tenants.push(action.payload);
    },
    updateTenantStatus(state, action) {
      const { id, status } = action.payload;
      const tenant = state.tenants.find((t) => t.id === id);
      if (tenant) {
        tenant.subscription.status = status;
      }
    },
    updateTenant(state, action) {
      const updatedTenant = action.payload;
      const index = state.tenants.findIndex((t) => t.id === updatedTenant.id);
      if (index !== -1) {
        state.tenants[index] = { ...state.tenants[index], ...updatedTenant };
      }
    },
    setActiveTenantId(state, action) {
      state.activeTenantId = action.payload;
      localStorage.setItem('activeTenantId', action.payload);
    },
  },
});

export const {
  setLoading,
  setTenants,
  addTenant,
  updateTenantStatus,
  updateTenant,
  setActiveTenantId,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
