import axios from 'axios';
import { redirectToLogin } from '@/utils/authRedirect';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/clear-session') &&
      !originalRequest.url?.includes('/auth/validate') &&
      !originalRequest.url?.includes('/auth/verify-email') &&
      !originalRequest.url?.includes('/register/')
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch {
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          redirectToLogin();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
