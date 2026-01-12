// Application Configuration
export const APP_CONFIG = {
    name: 'MEDSTARGENX',
    version: '1.0.0',
    description: 'Medical Research and Patient Management System',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    sessionTimeout: Number(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000,
    features: {
        research: import.meta.env.VITE_ENABLE_RESEARCH === 'true',
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    },
} as const;

export const AUTH_CONFIG = {
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'medstargenx_auth_token',
    refreshTokenKey: 'medstargenx_refresh_token',
} as const;
