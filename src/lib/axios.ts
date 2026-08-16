import axios from 'axios';
import Cookies from 'js-cookie';

const rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://task-management-backend-d5pm.onrender.com';
const API_BASE_URL = rawUrl.endsWith('/api')
  ? rawUrl
  : `${rawUrl.replace(/\/$/, '')}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('accessToken');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
