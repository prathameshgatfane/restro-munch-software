import { createSlice } from '@reduxjs/toolkit';
import { getStoredTenants, saveStoredTenants } from '../../../../services/mock/tenantService';

const initialState = {
  tenants: getStoredTenants(),
  activeTenantId: localStorage.getItem('activeTenantId') || 'restro_1',
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
      saveStoredTenants(action.payload);
    },
    addTenant(state, action) {
      state.tenants.unshift(action.payload);
      saveStoredTenants(state.tenants);
    },
    updateTenantStatus(state, action) {
      const { id, status } = action.payload;
      const tenant = state.tenants.find((t) => t.id === id);
      if (tenant) {
        tenant.subscription.status = status;
        saveStoredTenants(state.tenants);
      }
    },
    updateTenantSubscription(state, action) {
      const { id, plan, renewDate, monthlyPrice } = action.payload;
      const tenant = state.tenants.find((t) => t.id === id);
      if (tenant) {
        tenant.subscription.plan = plan;
        tenant.subscription.renewDate = renewDate;
        if (monthlyPrice) tenant.subscription.monthlyPrice = monthlyPrice;
        saveStoredTenants(state.tenants);
      }
    },
    updateTenant(state, action) {
      const updatedTenant = action.payload;
      const index = state.tenants.findIndex((t) => t.id === updatedTenant.id);
      if (index !== -1) {
        state.tenants[index] = { ...state.tenants[index], ...updatedTenant };
        saveStoredTenants(state.tenants);
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
  updateTenantSubscription,
  updateTenant,
  setActiveTenantId,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
