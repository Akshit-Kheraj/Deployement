// Routes Configuration
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    AUTH: '/auth',
    PATIENT_PROFILE: '/patient/:id',
    PATIENT_RECORDS: '/records',
    RESEARCH: '/research',
    SETTINGS: '/settings',
    PRICING: '/pricing',
    NOT_FOUND: '*',
} as const;

export const getPatientProfileRoute = (id: string) => `/patient/${id}`;
