import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG, AUTH_CONFIG } from '@/constants';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: APP_CONFIG.apiUrl,
    timeout: APP_CONFIG.apiTimeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(AUTH_CONFIG.tokenKey);

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - Clear token and redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem(AUTH_CONFIG.tokenKey);
            localStorage.removeItem('refreshToken');

            // Redirect to login page
            if (window.location.pathname !== '/auth') {
                window.location.href = '/auth';
            }
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
