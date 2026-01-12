import apiClient from './api/client';
import { AUTH_CONFIG } from '@/constants';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    userType?: 'doctor' | 'admin';
    specialization?: string;
    licenseNumber?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: 'doctor' | 'admin';
    isApproved?: boolean;
    specialization?: string;
    licenseNumber?: string;
    createdAt?: string;
    lastLogin?: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken?: string;
    };
}

export interface ProfileUpdateData {
    name?: string;
    email?: string;
}

/**
 * Authentication Service
 */
export const authService = {
    /**
     * Register a new user
     */
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', data);

        // Store tokens
        if (response.data.success && response.data.data) {
            localStorage.setItem(AUTH_CONFIG.tokenKey, response.data.data.accessToken);
            if (response.data.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
        }

        return response.data;
    },

    /**
     * Login user
     */
    login: async (credentials: LoginData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);

        // Store tokens
        if (response.data.success && response.data.data) {
            localStorage.setItem(AUTH_CONFIG.tokenKey, response.data.data.accessToken);
            if (response.data.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
        }

        return response.data;
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/api/auth/logout');
        } finally {
            // Clear tokens regardless of API response
            localStorage.removeItem(AUTH_CONFIG.tokenKey);
            localStorage.removeItem('refreshToken');
        }
    },

    /**
     * Get current logged-in user
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/api/auth/me');
        return response.data.data.user;
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: ProfileUpdateData): Promise<User> => {
        const response = await apiClient.put<{ success: boolean; data: { user: User } }>(
            '/api/auth/profile',
            data
        );
        return response.data.data.user;
    },

    /**
     * Refresh access token
     */
    refreshToken: async (): Promise<string> => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post<{ success: boolean; data: { accessToken: string } }>(
            '/api/auth/refresh',
            { refreshToken }
        );

        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem(AUTH_CONFIG.tokenKey, newAccessToken);

        return newAccessToken;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(AUTH_CONFIG.tokenKey);
    },
};
