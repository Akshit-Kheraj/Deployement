import { Patient } from '@/types/patient';

export const parseCSV = async (file: File): Promise<Patient[]> => {
  try {
    // Call ML API for predictions
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(import.meta.env.VITE_ML_API_URL || 'http://localhost:5001/api/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to get predictions from ML API');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Prediction failed');
    }

    // Transform API response to Patient format
    return data.patients.map((patient: any) => ({
      patientId: patient.id,  // Backend expects 'patientId' not 'id'
      id: patient.id,         // Keep for frontend compatibility
      name: patient.name,
      age: patient.age || 0,
      gender: patient.gender as 'Male' | 'Female' | 'Other',
      bloodType: patient.bloodType,
      riskScore: patient.riskScore,
      status: patient.status,
      prediction: patient.prediction || 'Cancer',  // Required by backend
      riskCategory: patient.riskCategory || 'High Risk',  // Required by backend
      biomarkers: patient.biomarkers,
      modelProbabilities: patient.modelProbabilities,  // Include full object for backend
      lastAnalysis: patient.lastAnalysis,
      indicators: [
        { label: 'Random Forest', value: patient.modelProbabilities.randomForest },
        { label: 'Gradient Boosting', value: patient.modelProbabilities.gradientBoosting },
        { label: 'XGBoost', value: patient.modelProbabilities.xgboost },
        { label: 'Risk Category', value: patient.riskScore },
      ],
    }));
  } catch (error) {
    console.error('Error calling ML API:', error);
    throw error;
  }
};

export const generateSampleCSV = (): string => {
  const header = 'id,name,age,gender,bloodType';
  const rows = [
    'PAT-0001,Sarah Mitchell,45,Female,A+',
    'PAT-0002,James Wilson,62,Male,O+',
    'PAT-0003,Emily Chen,38,Female,B+',
    'PAT-0004,Michael Brown,55,Male,AB-',
    'PAT-0005,Lisa Anderson,41,Female,O-',
    'PAT-0006,Robert Taylor,58,Male,A-',
    'PAT-0007,Jennifer Davis,33,Female,B-',
    'PAT-0008,David Martinez,67,Male,O+',
  ];

  return [header, ...rows].join('\n');
};

// Synchronous version for generating sample patient data (for UI demos)
export const generateSamplePatients = (): Patient[] => {
  const sampleData = [
    { id: 'PAT-0001', name: 'Sarah Mitchell', age: 45, gender: 'Female' as const, bloodType: 'A+', riskScore: 72 },
    { id: 'PAT-0002', name: 'James Wilson', age: 62, gender: 'Male' as const, bloodType: 'O+', riskScore: 85 },
    { id: 'PAT-0003', name: 'Emily Chen', age: 38, gender: 'Female' as const, bloodType: 'B+', riskScore: 34 },
    { id: 'PAT-0004', name: 'Michael Brown', age: 55, gender: 'Male' as const, bloodType: 'AB-', riskScore: 58 },
    { id: 'PAT-0005', name: 'Lisa Anderson', age: 41, gender: 'Female' as const, bloodType: 'O-', riskScore: 23 },
    { id: 'PAT-0006', name: 'Robert Taylor', age: 58, gender: 'Male' as const, bloodType: 'A-', riskScore: 67 },
    { id: 'PAT-0007', name: 'Jennifer Davis', age: 33, gender: 'Female' as const, bloodType: 'B-', riskScore: 19 },
    { id: 'PAT-0008', name: 'David Martinez', age: 67, gender: 'Male' as const, bloodType: 'O+', riskScore: 91 },
  ];

  return sampleData.map(patient => ({
    ...patient,
    status: patient.riskScore > 70 ? 'Malignant' : patient.riskScore > 40 ? 'Under Review' : 'Benign',
    biomarkers: [
      {
        name: 'Ct_JAK2_V617F',
        value: Math.random() * 30 + 20,
        normalRange: '20-30',
        status: Math.random() > 0.5 ? 'elevated' : 'normal',
      },
      {
        name: 'Hemoglobin',
        value: Math.random() * 4 + 12,
        normalRange: '12-16 g/dL',
        status: 'normal',
      },
    ],
    lastAnalysis: new Date().toISOString().split('T')[0],
    indicators: [
      { label: 'Random Forest', value: Math.round(patient.riskScore + Math.random() * 10 - 5) },
      { label: 'Gradient Boosting', value: Math.round(patient.riskScore + Math.random() * 10 - 5) },
      { label: 'XGBoost', value: Math.round(patient.riskScore + Math.random() * 10 - 5) },
    ],
  }));
};
