"""
==================================================================================
CANCER PREDICTION API - Flask REST API
==================================================================================
Purpose: REST API for cancer prediction using trained ML models
Integrates with MEDSTARGENX React frontend
==================================================================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import io
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

# CORS Configuration - Allow requests from production domain and localhost
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:8080",
            "https://mgenx.com",
            "http://mgenx.com",
            "https://www.mgenx.com",
            "http://www.mgenx.com"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Global variables for models
models = {
    'rf_model': None,
    'gb_model': None,
    'xgb_model': None,
    'scaler': None,
    # Updated to match YOUR CSV column names
    'numeric_features': [
        'Ct_JAK2_V', 'Ct_microR', 'Ct_HLA_T', 'Ct_REF_G',
        'Hb', 'RBC', 'WBC', 'Platelet', 'Drug_Resi', 'Ct_JAK2'
    ],
    'trained': False
}

def categorize_risk(prob):
    """Categorize cancer probability into risk levels"""
    if prob < 0.30:
        return 'Low Risk', 'benign'
    elif prob < 0.60:
        return 'Moderate Risk', 'under_review'
    elif prob < 0.85:
        return 'High Risk', 'malignant'
    else:
        return 'Very High Risk', 'malignant'

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_trained': models['trained']
    })

@app.route('/api/train', methods=['POST'])
def train_models():
    """Train ML models with uploaded training data"""
    try:
        # Get file from request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Read CSV
        df = pd.read_csv(io.StringIO(file.stream.read().decode('utf-8')))
        
        # Check required columns
        required_cols = models['numeric_features'] + ['Diagnosis']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            return jsonify({
                'error': f'Missing required columns: {missing_cols}'
            }), 400
        
        # Prepare data
        X = df[models['numeric_features']].copy()
        
        # Binary classification
        y_binary = df['Diagnosis'].apply(
            lambda x: 'Cancer' if x in ['Leukemia_Positive', 'PV_Positive'] else 'Non-Cancer'
        )
        y_binary_encoded = (y_binary == 'Cancer').astype(int)
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_binary_encoded, test_size=0.2, random_state=42, stratify=y_binary_encoded
        )
        
        # Scaling
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # SMOTE
        smote = SMOTE(random_state=42)
        X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)
        
        # Train Random Forest
        rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced',
            n_jobs=-1
        )
        rf_model.fit(X_train_balanced, y_train_balanced)
        rf_accuracy = rf_model.score(X_test_scaled, y_test)
        
        # Train Gradient Boosting
        gb_model = GradientBoostingClassifier(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=10,
            random_state=42,
            subsample=0.8
        )
        gb_model.fit(X_train_balanced, y_train_balanced)
        gb_accuracy = gb_model.score(X_test_scaled, y_test)
        
        # Train XGBoost
        xgb_model = xgb.XGBClassifier(
            n_estimators=200,
            max_depth=10,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric='logloss',
            use_label_encoder=False
        )
        xgb_model.fit(X_train_balanced, y_train_balanced)
        xgb_accuracy = xgb_model.score(X_test_scaled, y_test)
        
        # Store models
        models['rf_model'] = rf_model
        models['gb_model'] = gb_model
        models['xgb_model'] = xgb_model
        models['scaler'] = scaler
        models['trained'] = True
        
        return jsonify({
            'success': True,
            'message': 'Models trained successfully',
            'results': {
                'random_forest_accuracy': float(rf_accuracy),
                'gradient_boosting_accuracy': float(gb_accuracy),
                'xgboost_accuracy': float(xgb_accuracy),
                'samples_trained': len(df)
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make predictions on uploaded patient data"""
    try:
        # Check if models are trained
        if not models['trained']:
            return jsonify({
                'error': 'Models not trained yet. Please train models first.'
            }), 400
        
        # Get file from request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Read CSV
        df = pd.read_csv(io.StringIO(file.stream.read().decode('utf-8')))
        
        # Rename Delta column if present
        if 'ΔCt_JAK2' in df.columns:
            df = df.rename(columns={'ΔCt_JAK2': 'Ct_JAK2'})
        
        # Check required features
        missing_features = [f for f in models['numeric_features'] if f not in df.columns]
        if missing_features:
            return jsonify({
                'error': f'Missing required features: {missing_features}'
            }), 400
        
        # Extract features
        X_predict = df[models['numeric_features']].copy()
        X_predict_scaled = models['scaler'].transform(X_predict)
        
        # Get predictions from all 3 models
        rf_proba = models['rf_model'].predict_proba(X_predict_scaled)[:, 1]
        gb_proba = models['gb_model'].predict_proba(X_predict_scaled)[:, 1]
        xgb_proba = models['xgb_model'].predict_proba(X_predict_scaled)[:, 1]
        
        # Ensemble prediction (average)
        ensemble_proba = (rf_proba + gb_proba + xgb_proba) / 3
        ensemble_pred = (ensemble_proba >= 0.5).astype(int)
        
        # Create results
        results = []
        for idx, row in df.iterrows():
            prob = float(ensemble_proba[idx])
            risk_category, status = categorize_risk(prob)
            
            patient_result = {
                'id': row.get('Sample_ID', f'PAT-{idx+1:04d}'),
                'name': row.get('name', f'Patient {idx+1}'),
                'age': int(row.get('age', 0)) if 'age' in row else None,
                'gender': row.get('gender', 'Unknown'),
                'bloodType': row.get('bloodType', 'Unknown'),
                'riskScore': round(prob * 100, 2),
                'status': status.title().replace('_', ' '),
                'prediction': 'Cancer' if ensemble_pred[idx] == 1 else 'Non-Cancer',
                'riskCategory': risk_category,
                'biomarkers': [
                    {
                        'name': 'JAK2 V617F (Ct)',
                        'value': float(row['Ct_JAK2_V617F']),
                        'normalRange': '20-30',
                        'status': 'critical' if row['Ct_JAK2_V617F'] < 15 else ('elevated' if row['Ct_JAK2_V617F'] < 20 else 'normal')
                    },
                    {
                        'name': 'Hemoglobin',
                        'value': float(row['Hb']),
                        'normalRange': '12.0-17.5 g/dL',
                        'status': 'critical' if (row['Hb'] < 7.0 or row['Hb'] > 20.0) else ('abnormal' if not (12.0 <= row['Hb'] <= 17.5) else 'normal')
                    },
                    {
                        'name': 'WBC Count',
                        'value': float(row['WBC']),
                        'normalRange': '4.0-11.0 K/μL',
                        'status': 'critical' if (row['WBC'] > 30.0 or row['WBC'] < 2.0) else ('elevated' if row['WBC'] > 11.0 else ('abnormal' if row['WBC'] < 4.0 else 'normal'))
                    },
                    {
                        'name': 'Platelet Count',
                        'value': float(row['Platelet']),
                        'normalRange': '150-400 K/μL',
                        'status': 'critical' if (row['Platelet'] < 50 or row['Platelet'] > 1000) else ('abnormal' if not (150 <= row['Platelet'] <= 400) else 'normal')
                    }
                ],
                'lastAnalysis': pd.Timestamp.now().strftime('%Y-%m-%d'),
                'modelProbabilities': {
                    'randomForest': round(float(rf_proba[idx]) * 100, 2),
                    'gradientBoosting': round(float(gb_proba[idx]) * 100, 2),
                    'xgboost': round(float(xgb_proba[idx]) * 100, 2)
                }
            }
            results.append(patient_result)
        
        # Summary statistics
        summary = {
            'totalPatients': len(results),
            'cancerCases': int((ensemble_pred == 1).sum()),
            'nonCancerCases': int((ensemble_pred == 0).sum()),
            'averageRiskScore': round(float(ensemble_proba.mean() * 100), 2),
            'highRiskCount': int(sum(1 for p in ensemble_proba if p >= 0.60)),
            'riskDistribution': {
                'low': int(sum(1 for p in ensemble_proba if p < 0.30)),
                'moderate': int(sum(1 for p in ensemble_proba if 0.30 <= p < 0.60)),
                'high': int(sum(1 for p in ensemble_proba if 0.60 <= p < 0.85)),
                'veryHigh': int(sum(1 for p in ensemble_proba if p >= 0.85))
            }
        }
        
        return jsonify({
            'success': True,
            'patients': results,
            'summary': summary
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🏥 Cancer Prediction API Server")
    print("=" * 50)
    
    # Auto-load trained models
    import os
    import pickle
    models_dir = 'trained_models'
    
    if os.path.exists(models_dir):
        try:
            print("📦 Loading trained models...")
            with open(f'{models_dir}/rf_model.pkl', 'rb') as f:
                models['rf_model'] = pickle.load(f)
            with open(f'{models_dir}/gb_model.pkl', 'rb') as f:
                models['gb_model'] = pickle.load(f)
            with open(f'{models_dir}/xgb_model.pkl', 'rb') as f:
                models['xgb_model'] = pickle.load(f)
            with open(f'{models_dir}/scaler.pkl', 'rb') as f:
                models['scaler'] = pickle.load(f)
            with open(f'{models_dir}/features.pkl', 'rb') as f:
                models['numeric_features'] = pickle.load(f)
            
            models['trained'] = True
            print("✅ Models loaded successfully!")
            print(f"✅ Using features: {models['numeric_features']}")
        except Exception as e:
            print(f"⚠️ Could not load models: {e}")
            print("⚠️ Models need to be trained first")
    else:
        print("⚠️ No trained models found")
        print("⚠️ Run train_models.py first to train the models")
    
    print("Server running on: http://localhost:5001")
    print("Frontend URL: http://localhost:8080 or https://mgenx.com")
    print("=" * 50)
    
    # Use debug mode only in development
    import os
    debug_mode = os.getenv('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=5001, debug=debug_mode)
