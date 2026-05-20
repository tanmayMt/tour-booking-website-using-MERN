import axios from 'axios';
import { getAuthToken } from './auth.js';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
