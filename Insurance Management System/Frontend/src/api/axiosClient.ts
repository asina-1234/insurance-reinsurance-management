import axios from 'axios';
import { clearStoredUser, getStoredUser } from '../utils/storage';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    if (error.response?.status === 401 && !url.includes('/auth/')) {
      clearStoredUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;