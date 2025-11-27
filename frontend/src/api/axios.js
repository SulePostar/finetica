import axios from 'axios';

// Centralized axios instance with default configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies/sessions
});

// Request interceptor - add auth token if exists
apiClient.interceptors.request.use(
    (config) => {
        // You can add token from localStorage or context
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 (unauthorized) - redirect to login
        if (error.response?.status === 401) {
            // window.location.href = '/login';
        }

        // Handle 403 (forbidden)
        if (error.response?.status === 403) {
            // Handle forbidden
        }

        // Handle 500 (server error)
        if (error.response?.status >= 500) {
            // Show error notification
        }

        return Promise.reject(error);
    }
);

export default apiClient;

