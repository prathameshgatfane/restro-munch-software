import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      const { user, tokens } = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = user;
      state.accessToken = tokens.access;
      state.refreshToken = tokens.refresh;
      state.error = null;
      
      // Persist locally
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    updateUserTokens(state, action) {
      const { access, refresh } = action.payload;
      state.accessToken = access;
      state.refreshToken = refresh;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  updateUserTokens,
} = authSlice.actions;

export default authSlice.reducer;
