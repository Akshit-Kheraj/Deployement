import apiClient from './api/client';

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    userType: 'doctor' | 'admin';
    isApproved: boolean;
    isActive: boolean;
    specialization?: string;
    licenseNumber?: string;
    approvedBy?: {
        _id: string;
        name: string;
        email: string;
    };
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminStats {
    totalUsers: number;
    pendingUsers: number;
    approvedUsers: number;
    totalPatients: number;
    totalDoctors: number;
    inactiveUsers: number;
}

export interface AdminUsersResponse {
    success: boolean;
    count: number;
    data: AdminUser[];
}

export interface AdminStatsResponse {
    success: boolean;
    data: AdminStats;
}

export interface AdminActionResponse {
    success: boolean;
    message: string;
    data?: AdminUser;
}

/**
 * Admin Service
 */
const adminService = {
    /**
     * Get all pending users
     */
    getPendingUsers: async (): Promise<AdminUser[]> => {
        const response = await apiClient.get<AdminUsersResponse>('/api/admin/pending-users');
        return response.data.data;
    },

    /**
     * Get all users with optional filters
     */
    getAllUsers: async (params?: {
        status?: 'approved' | 'pending' | 'all';
        userType?: 'doctor' | 'admin' | 'all';
        search?: string;
    }): Promise<AdminUser[]> => {
        const response = await apiClient.get<AdminUsersResponse>('/api/admin/users', { params });
        return response.data.data;
    },

    /**
     * Approve a user
     */
    approveUser: async (userId: string): Promise<AdminActionResponse> => {
        const response = await apiClient.put<AdminActionResponse>(`/api/admin/approve-user/${userId}`);
        return response.data;
    },

    /**
     * Reject a user
     */
    rejectUser: async (userId: string): Promise<AdminActionResponse> => {
        const response = await apiClient.put<AdminActionResponse>(`/api/admin/reject-user/${userId}`);
        return response.data;
    },

    /**
     * Get admin dashboard statistics
     */
    getStats: async (): Promise<AdminStats> => {
        const response = await apiClient.get<AdminStatsResponse>('/api/admin/stats');
        return response.data.data;
    },
};

export default adminService;
