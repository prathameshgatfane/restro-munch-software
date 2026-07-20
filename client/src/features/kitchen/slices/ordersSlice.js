import { createSlice } from '@reduxjs/toolkit';
import { ORDER_STATUS } from '../../../constants/orderStatus';

const initialState = {
  // Array of table sessions, which hold KOTs and payment data
  sessions: [], 
  isLoading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setSessions(state, action) {
      state.sessions = action.payload;
    },
    createSession(state, action) {
      // payload: { restaurantId, tableId, tableSessionId }
      state.sessions.push({
        ...action.payload,
        kots: [],
        billStatus: 'unpaid',
        payments: []
      });
    },
    addKOT(state, action) {
      // payload: { tableSessionId, kotId, items, timestamp, status }
      const session = state.sessions.find(s => s.tableSessionId === action.payload.tableSessionId);
      if (session) {
        session.kots.push(action.payload);
      }
    },
    updateKOTStatus(state, action) {
      // payload: { kotId, status }
      for (const session of state.sessions) {
        const kot = session.kots.find(k => k.kotId === action.payload.kotId);
        if (kot) {
          kot.status = action.payload.status;
          break;
        }
      }
    },
    addPayment(state, action) {
      // payload: { tableSessionId, method, amount }
      const session = state.sessions.find(s => s.tableSessionId === action.payload.tableSessionId);
      if (session) {
        session.payments.push({ method: action.payload.method, amount: action.payload.amount });
      }
    },
    settleSession(state, action) {
      // payload: tableSessionId
      const session = state.sessions.find(s => s.tableSessionId === action.payload);
      if (session) {
        session.billStatus = 'paid';
      }
    },
  },
});

export const {
  setLoading,
  setSessions,
  createSession,
  addKOT,
  updateKOTStatus,
  addPayment,
  settleSession,
} = ordersSlice.actions;

export default ordersSlice.reducer;
