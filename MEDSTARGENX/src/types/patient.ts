export interface Patient {
  _id?: string;
  patientId?: string;
  id: string; // Keep for backward compatibility, might map to patientId or _id
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  riskScore: number;
  status: 'Malignant' | 'Benign' | 'Under Review';
  biomarkers: {
    name: string;
    value: number;
    normalRange: string;
    status: 'normal' | 'elevated' | 'critical' | 'abnormal';
  }[];
  lastAnalysis: string;
  modelProbabilities?: {
    randomForest: number;
    gradientBoosting: number;
    xgboost: number;
  };
  indicators?: {
    label: string;
    value: number;
  }[];
  recommendations?: string[];
}

export interface CSVRow {
  [key: string]: string;
}
