import { useSelector, useDispatch } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
} from '../features/auth/slices/authSlice';
import apiClient from '../services/api/apiClient';
import { ENDPOINTS } from '../services/api/endpoints';

/**
 * Custom Hook for Auth state and operations.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      // API call to log in (MSW mocked)
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      const { user: userData, tokens } = response.data.data;
      
      dispatch(loginSuccess({ user: userData, tokens }));
      return { success: true, user: userData };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      dispatch(loginFailure(errMsg));
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    try {
      // Best effort API call to logout
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (e) {
      console.warn('AuthService: Failed to notify logout on server', e);
    } finally {
      dispatch(logoutSuccess());
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};

export default useAuth;
