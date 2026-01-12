import apiClient from './api/client';
import { Patient } from '@/types/patient';

export interface PatientResponse {
    success: boolean;
    count?: number;
    total?: number;
    page?: number;
    pages?: number;
    data?: Patient | Patient[];
    message?: string;
}

export interface PatientStats {
    total: number;
    byStatus: {
        _id: string;
        count: number;
        avgRiskScore: number;
    }[];
}

class PatientService {
    /**
     * Save multiple patients to database (bulk upload)
     */
    async savePatients(patients: Partial<Patient>[]): Promise<PatientResponse> {
        try {
            const response = await apiClient.post('/api/patients/bulk', { patients });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to save patients');
        }
    }

    /**
     * Get all patients with optional search and filters
     */
    async getPatients(params?: {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<PatientResponse> {
        try {
            const response = await apiClient.get('/api/patients', { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch patients');
        }
    }

    /**
     * Get single patient by ID
     */
    async getPatientById(id: string): Promise<PatientResponse> {
        try {
            const response = await apiClient.get(`/api/patients/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch patient');
        }
    }

    /**
     * Update patient details
     */
    async updatePatient(id: string, data: Partial<Patient>): Promise<PatientResponse> {
        try {
            const response = await apiClient.put(`/api/patients/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update patient');
        }
    }

    /**
     * Delete patient by ID
     */
    async deletePatient(id: string): Promise<PatientResponse> {
        try {
            const response = await apiClient.delete(`/api/patients/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete patient');
        }
    }

    /**
     * Get patient statistics
     */
    async getStats(): Promise<{ success: boolean; data: PatientStats }> {
        try {
            const response = await apiClient.get('/api/patients/stats');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
        }
    }
}

export default new PatientService();
