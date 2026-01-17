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
  prediction?: 'Cancer' | 'Non-Cancer';
  riskCategory?: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';

  // Clinical Prediction Fields
  drugAndDoseSuggestions?: string;
  predictedResponseProbability?: number;
  pharmacogenomicStatus?: string;
  predictedToxicityType?: string;
  adrs?: string;
  contraindications?: string;
  predictedResistanceType?: string;
  resistanceManagementAction?: string;
  monitoringAlert?: string;
  doseAdjustmentRecommendation?: string;
  clinicalActionAlert?: string;

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
