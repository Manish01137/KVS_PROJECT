import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kvs_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const code = err.response?.data?.code;
      localStorage.removeItem('kvs_token');
      localStorage.removeItem('kvs_user');
      // Only redirect if not already on login/register/reset pages
      const path = window.location.pathname;
      if (!['/login', '/register', '/forgot-password'].some(p => path.startsWith(p))) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default API;
