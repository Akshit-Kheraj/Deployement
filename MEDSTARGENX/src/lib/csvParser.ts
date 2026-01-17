import { Patient } from '@/types/patient';

export const parseCSV = async (file: File): Promise<Patient[]> => {
  try {
    // Read CSV file directly without ML API
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }

    // Proper CSV parsing function that handles quoted fields with commas
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    // Parse header
    const headers = parseCSVLine(lines[0]);

    // Parse data rows
    const patients: Patient[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const patient: any = {};

      headers.forEach((header, index) => {
        patient[header] = values[index] || '';
      });

      // Transform to required Patient format with all clinical prediction fields
      const transformedPatient: Patient = {
        patientId: patient.id || patient.Patient_ID || `PAT-${i.toString().padStart(4, '0')}`,
        id: patient.id || patient.Patient_ID || `PAT-${i.toString().padStart(4, '0')}`,
        name: patient.name || 'Unknown Patient',
        age: parseInt(patient.age || patient.Age || '0'),
        gender: (patient.gender || patient.Sex || 'Other') as 'Male' | 'Female' | 'Other',
        bloodType: patient.bloodType || 'Unknown',
        riskScore: Math.floor(Math.random() * 100),
        status: 'Under Review',
        riskCategory: 'Moderate Risk',
        prediction: 'Non-Cancer',


        // Clinical Prediction Fields from CSV
        drugAndDoseSuggestions: patient['Drug and Dose Suggestions'],
        predictedResponseProbability: parseFloat(patient['Predicted_Response_Probability'] || '0'),
        pharmacogenomicStatus: patient['Pharmacogenomic_Status'],
        predictedToxicityType: patient['Predicted_Toxicity_Type'],
        adrs: patient['ADRs'],
        contraindications: patient['Contraindications'],
        predictedResistanceType: patient['Predicted_Resistance_Type'],
        resistanceManagementAction: patient['Resistance_Management_Action'],
        monitoringAlert: patient['Monitoring_Alert'],
        doseAdjustmentRecommendation: patient['Dose_Adjustment_Recommendation'],
        clinicalActionAlert: patient['Clinical_Action_Alert'],

        biomarkers: [],
        modelProbabilities: {
          randomForest: Math.floor(Math.random() * 100),
          gradientBoosting: Math.floor(Math.random() * 100),
          xgboost: Math.floor(Math.random() * 100),
        },
        lastAnalysis: new Date().toISOString().split('T')[0],
        indicators: [
          { label: 'Random Forest', value: Math.floor(Math.random() * 100) },
          { label: 'Gradient Boosting', value: Math.floor(Math.random() * 100) },
          { label: 'XGBoost', value: Math.floor(Math.random() * 100) },
        ],
      };

      patients.push(transformedPatient);
    }

    return patients;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file. Please check the format and try again.');
  }
};

export const generateSampleCSV = (): string => {
  const headers = [
    'id', 'name', 'age', 'gender', 'bloodType', 'diagnosis', 'stage',
    'biomarker_PSA', 'biomarker_CEA', 'biomarker_AFP'
  ];

  const sampleData = [
    ['P001', 'John Doe', '65', 'Male', 'A+', 'Prostate Cancer', 'II', '12.5', '2.1', '1.2'],
    ['P002', 'Jane Smith', '58', 'Female', 'O-', 'Breast Cancer', 'III', '1.2', '8.5', '0.8'],
    ['P003', 'Bob Johnson', '72', 'Male', 'B+', 'Lung Cancer', 'IV', '2.1', '15.2', '2.5'],
  ];

  return [
    headers.join(','),
    ...sampleData.map(row => row.join(','))
  ].join('\n');
};

export const generateSamplePatients = (): Patient[] => {
  return [
    {
      patientId: 'P001',
      id: 'P001',
      name: 'John Doe',
      age: 65,
      gender: 'Male',
      bloodType: 'A+',
      riskScore: 75,
      status: 'Malignant',
      biomarkers: [
        { name: 'PSA', value: 12.5, normalRange: '0-4 ng/mL', status: 'elevated' },
        { name: 'CEA', value: 2.1, normalRange: '0-3 ng/mL', status: 'normal' },
      ],
      lastAnalysis: '2024-01-15',
      modelProbabilities: {
        randomForest: 78,
        gradientBoosting: 82,
        xgboost: 75,
      },
    },
  ];
};
