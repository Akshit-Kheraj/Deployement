# Cancer Prediction ML API

Flask-based REST API for cancer prediction using trained machine learning models.

## Setup

### 1. Install Python Dependencies

```bash
cd ml_api
pip install -r requirements.txt
```

### 2. Start the ML API Server

```bash
python cancer_api.py
```

The API will run on: **http://localhost:5001**

## API Endpoints

### Health Check
```
GET /api/health
```

### Train Models (Optional - if you want to retrain)
```
POST /api/train
Body: FormData with 'file' (CSV with training data)
```

### Get Predictions
```
POST /api/predict
Body: FormData with 'file' (CSV with patient data)
```

## CSV Format Required

Your CSV must have these columns:
- `Ct_JAK2_V617F`
- `Ct_microRNA_155`
- `Ct_HLA_Tcell`
- `Hb` (Hemoglobin)
- `RBC` (Red Blood Cell count)
- `WBC` (White Blood Cell count)
- `Platelet`
- `Drug_Resistance_Index`
- `Ct_JAK2`

Optional columns:
- `Sample_ID`
- `name`
- `age`
- `gender`
- `bloodType`

## How It Works

1. Frontend uploads CSV file
2. ML API receives file and extracts features
3. Three models make predictions:
   - Random Forest
   - Gradient Boosting
   - XGBoost
4. Ensemble prediction (average of 3 models)
5. Risk categorization:
   - Low Risk: 0-30%
   - Moderate Risk: 31-60%
   - High Risk: 61-85%
   - Very High Risk: 86-100%
6. Returns JSON with patient predictions

## Integration with Frontend

The frontend automatically calls this API when you upload a CSV file in the Dashboard.

**Make sure both servers are running:**
- Frontend: http://localhost:8080
- Auth Backend: http://localhost:5000
- ML API: http://localhost:5001
