import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string,
        userType?: 'doctor' | 'admin',
        specialization?: string,
        licenseNumber?: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (data: { name?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            if (authService.isAuthenticated()) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            // Clear invalid tokens
            localStorage.removeItem('medstargenx_auth_token');
            localStorage.removeItem('refreshToken');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            setUser(response.data.user);

            toast({
                title: 'Success',
                description: 'Logged in successfully',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        userType?: 'doctor' | 'admin',
        specialization?: string,
        licenseNumber?: string
    ) => {
        try {
            const response = await authService.register({
                name,
                email,
                password,
                userType,
                specialization,
                licenseNumber
            });

            // Only set user if they were auto-approved (admins)
            if (response.data.user.isApproved) {
                setUser(response.data.user);
            }

            toast({
                title: 'Success',
                description: response.message || response.data.user.isApproved
                    ? 'Account created successfully'
                    : 'Registration successful. Your account is pending admin approval.',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);

            toast({
                title: 'Success',
                description: 'Logged out successfully',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUserProfile = async (data: { name?: string; email?: string }) => {
        try {
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);

            toast({
                title: 'Success',
                description: 'Profile updated successfully',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
