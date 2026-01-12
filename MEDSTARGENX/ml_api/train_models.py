"""
Train ML models using leukemia dataset and save to disk
"""

import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

print("=" * 60)
print("TRAINING CANCER PREDICTION MODELS")
print("=" * 60)

# Load data with UTF-8 encoding
print("\n📊 Loading training data...")
df = pd.read_csv('e:/Prediction/leukemia_Positive.csv', encoding='utf-8')

# Rename the Delta column to avoid encoding issues
if 'ΔCt_JAK2' in df.columns:
    df = df.rename(columns={'ΔCt_JAK2': 'Ct_JAK2'})
    print("✅ Renamed ΔCt_JAK2 → Ct_JAK2")

print(f"✅ Loaded {len(df)} samples")
print(f"✅ Columns: {list(df.columns)}")
print(f"✅ Diagnosis distribution:\n{df['Diagnosis'].value_counts()}")

# Prepare features (matching your CSV column names)
numeric_features = [
    'Ct_JAK2_V617F', 'Ct_microRNA_155', 'Ct_HLA_Tcell', 'Ct_REF_GAPDH',
    'Hb', 'RBC', 'WBC', 'Platelet', 'Drug_Resistance_Index', 'Ct_JAK2'
]

X = df[numeric_features].copy()

# Binary classification: Cancer vs Non-Cancer
y_binary = df['Diagnosis'].apply(
    lambda x: 'Cancer' if x in ['Leukemia_Positive', 'PV_Positive'] else 'Non-Cancer'
)
y_binary_encoded = (y_binary == 'Cancer').astype(int)

print(f"\n🎯 Cancer cases: {(y_binary_encoded == 1).sum()}")
print(f"🎯 Non-cancer cases: {(y_binary_encoded == 0).sum()}")

# Train-test split
print("\n📊 Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y_binary_encoded, test_size=0.2, random_state=42, stratify=y_binary_encoded
)

# Scaling
print("⚖️ Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# SMOTE
print("🔄 Balancing classes with SMOTE...")
smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)

# Train Random Forest
print("\n🌲 Training Random Forest...")
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
print(f"✅ Random Forest Accuracy: {rf_accuracy*100:.2f}%")

# Train Gradient Boosting
print("\n⚡ Training Gradient Boosting...")
gb_model = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=10,
    random_state=42,
    subsample=0.8
)
gb_model.fit(X_train_balanced, y_train_balanced)
gb_accuracy = gb_model.score(X_test_scaled, y_test)
print(f"✅ Gradient Boosting Accuracy: {gb_accuracy*100:.2f}%")

# Train XGBoost
print("\n🚀 Training XGBoost...")
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
print(f"✅ XGBoost Accuracy: {xgb_accuracy*100:.2f}%")

# Save models
print("\n💾 Saving models to disk...")
models_dir = 'e:/Prediction/MEDSTARGENX/ml_api/trained_models'
import os
os.makedirs(models_dir, exist_ok=True)

with open(f'{models_dir}/rf_model.pkl', 'wb') as f:
    pickle.dump(rf_model, f)
    
with open(f'{models_dir}/gb_model.pkl', 'wb') as f:
    pickle.dump(gb_model, f)
    
with open(f'{models_dir}/xgb_model.pkl', 'wb') as f:
    pickle.dump(xgb_model, f)
    
with open(f'{models_dir}/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

# Save feature names
with open(f'{models_dir}/features.pkl', 'wb') as f:
    pickle.dump(numeric_features, f)

print(f"✅ Models saved to: {models_dir}")

print("\n" + "=" * 60)
print("✨ TRAINING COMPLETE!")
print("=" * 60)
print(f"\n📊 Model Performance Summary:")
print(f"  Random Forest:      {rf_accuracy*100:.2f}%")
print(f"  Gradient Boosting:  {gb_accuracy*100:.2f}%")
print(f"  XGBoost:            {xgb_accuracy*100:.2f}%")
print(f"  Average:            {(rf_accuracy + gb_accuracy + xgb_accuracy)/3*100:.2f}%")
print("\n🎯 Models are ready for use in the ML API!")
