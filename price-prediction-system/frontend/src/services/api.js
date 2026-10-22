import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pricespy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & 429 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired credentials
      localStorage.removeItem('pricespy_token');
      localStorage.removeItem('pricespy_user');
      window.dispatchEvent(new CustomEvent('pricespy_auth_expired'));
    } else if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      window.dispatchEvent(new CustomEvent('pricespy_rate_limited', {
        detail: { retryAfter, message: error.response.data?.detail || 'Too many requests. Please wait.' }
      }));
    }
    return Promise.reject(error);
  }
);

export default api;
