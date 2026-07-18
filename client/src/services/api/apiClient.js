import axios from 'axios';
import { ENDPOINTS } from './endpoints';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Attach access token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh & global error handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect offline network errors
    if (!navigator.onLine || error.message === 'Network Error') {
      // Add custom field to let feature code know it failed due to network
      error.isNetworkError = true;
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized (Expired Tokens)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === ENDPOINTS.AUTH.REFRESH) {
        // If the refresh token request itself fails, force logout
        localStorage.clear();
        window.dispatchEvent(new Event('auth-logout'));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.clear();
        window.dispatchEvent(new Event('auth-logout'));
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const { access, refresh } = response.data.data.tokens;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        apiClient.defaults.headers.common.Authorization = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;

        processQueue(null, access);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.dispatchEvent(new Event('auth-logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
