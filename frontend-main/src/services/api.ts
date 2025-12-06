import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      // Network error or server not reachable
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.error('Network error:', {
          message: error.message,
          code: error.code,
          baseURL: API_URL,
          url: error.config?.url,
        });
        error.message = 'Failed to fetch. Please check if the backend server is running.';
      }
    }
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/student/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;



