import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, ROUTES } from '../utils/constants';

const clearAuthSession = () => {
  localStorage.clear();
  if (window.location.pathname !== ROUTES.LOGIN) {
    window.location.href = ROUTES.LOGIN;
  }
};

const isInactiveAccountError = (data) => {
  if (!data) return false;
  return data.isActive === false || data.error === 'account is inactive';
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => {
    if (response?.data && isInactiveAccountError(response.data)) {
      clearAuthSession();
      return Promise.reject(new Error('account is inactive'));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && isInactiveAccountError(error.response.data)) {
      clearAuthSession();
      return Promise.reject(error);
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;

          // Update stored tokens
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          if (newRefreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }

          // Update the authorization header
          originalRequest.headers['Authorization'] = `Bearer ${token}`;

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout user
          clearAuthSession();
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - logout user
        clearAuthSession();
      }
    }

    return Promise.reject(error);
  }
);

export default api;