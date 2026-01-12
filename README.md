# 🏥 Cancer Diagnostic Prediction System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red.svg)](https://streamlit.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An AI-powered web application for cancer risk prediction using advanced machine learning models. The system analyzes biomarker data to provide cancer risk assessments with an intuitive, interactive interface.

![System Overview](https://img.icons8.com/fluency/96/000000/dna.png)

## 🎯 Features

- **Multi-Model Ensemble Learning**: Combines Random Forest, Gradient Boosting, and XGBoost for robust predictions
- **Interactive Web Interface**: Built with Streamlit for easy-to-use, professional UI
- **Risk Categorization**: Classifies patients into Low, Moderate, High, and Very High risk categories
- **Comprehensive Analytics**: Advanced visualizations and insights dashboard
- **Batch Prediction**: Upload CSV/Excel files to predict multiple patients at once
- **Export Results**: Download predictions as CSV for further analysis

## 📊 What It Analyzes

The system evaluates 9 key biomarkers:

| Biomarker | Description |
|-----------|-------------|
| `Ct_JAK2_V617F` | JAK2 V617F mutation detection |
| `Ct_microRNA_155` | MicroRNA-155 expression level |
| `Ct_HLA_Tcell` | HLA T-cell activity marker |
| `Hb` | Hemoglobin (blood oxygen capacity) |
| `RBC` | Red blood cell count |
| `WBC` | White blood cell count |
| `Platelet` | Platelet count for clotting |
| `Drug_Resistance_Index` | Treatment resistance measure |
| `Ct_JAK2` | Normalized JAK2 expression |

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Prediction
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv .venv
   
   # On Windows
   .venv\Scripts\activate
   
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

```bash
streamlit run cancer_prediction_app.py
```

The application will open in your default web browser at `http://localhost:8501`

## 📖 Usage Guide

### Step 1: Upload Training Data 📂

1. Navigate to **"Upload & Train"** page
2. Upload your training dataset (CSV or Excel)
3. Review data preview and statistics
4. Click **"Train Models"** button

### Step 2: Train Models 🚀

- The system trains 3 models simultaneously:
  - Random Forest (200 trees)
  - Gradient Boosting (200 estimators)
  - XGBoost (200 estimators)
- Training takes 1-2 minutes
- View accuracy scores upon completion

### Step 3: Make Predictions 🔮

1. Navigate to **"Predict"** page
2. Upload patient data file
3. Click **"Generate Predictions"**
4. Review results with risk categories

### Step 4: View Analytics 📊

Explore the analytics dashboard with:
- **Overview**: Distribution charts and statistics
- **Feature Analysis**: Feature importance and correlations
- **Risk Analysis**: Risk thresholds and high-risk patients
- **Model Comparison**: Individual model performance

### Step 5: Download Results 💾

- Download complete results as CSV
- Export high-risk patients only (≥60% probability)

## 🎨 Risk Categories

| Icon | Category | Probability | Recommendation |
|------|----------|-------------|----------------|
| 🟢 | **Low Risk** | 0-30% | Routine monitoring |
| 🟡 | **Moderate Risk** | 31-60% | Enhanced screening |
| 🟠 | **High Risk** | 61-85% | Immediate consultation |
| 🔴 | **Very High Risk** | 86-100% | Urgent medical attention |

## 📁 Project Structure

```
Prediction/
│
├── cancer_prediction_app.py    # Main Streamlit application
├── run_analysis.py              # Analysis and evaluation script
├── Analysis.ipynb               # Jupyter notebook for analysis
├── requirements.txt             # Python dependencies
├── leukemia_Positive.csv        # Sample dataset
│
├── .venv/                       # Virtual environment (created locally)
└── .git/                        # Git repository
```

## 🔬 Technical Details

### Machine Learning Pipeline

1. **Data Preprocessing**
   - Feature scaling using StandardScaler
   - Missing value handling
   - Data type validation

2. **Class Balancing**
   - SMOTE (Synthetic Minority Over-sampling Technique)
   - Handles imbalanced datasets

3. **Model Training**
   - Train-test split (80/20)
   - Stratified sampling
   - Cross-validation ready

4. **Ensemble Prediction**
   - Averages probabilities from all 3 models
   - More robust than single model predictions

### Models Used

- **Random Forest**: 200 estimators, max_depth=20, class_weight='balanced'
- **Gradient Boosting**: 200 estimators, learning_rate=0.1, max_depth=10
- **XGBoost**: 200 estimators, learning_rate=0.1, GPU support available

## 📊 Data Format

### Training Data Requirements

Your CSV/Excel file must include these columns:

```
Ct_JAK2_V617F, Ct_microRNA_155, Ct_HLA_Tcell, Hb, RBC, WBC, 
Platelet, Drug_Resistance_Index, Ct_JAK2, Diagnosis
```

**Example:**

| Ct_JAK2_V617F | Ct_microRNA_155 | ... | Diagnosis |
|---------------|-----------------|-----|-----------|
| 25.3 | 22.1 | ... | Leukemia_Positive |
| 35.2 | 28.4 | ... | Non-Cancer |

### Prediction Data Requirements

Same 9 biomarker columns (Diagnosis column optional)

## 🔧 Configuration

### Model Parameters

Edit `cancer_prediction_app.py` to adjust model parameters:

```python
# Random Forest
rf_model = RandomForestClassifier(
    n_estimators=200,      # Number of trees
    max_depth=20,          # Maximum depth
    min_samples_split=5,   # Min samples to split
    random_state=42
)
```

### Risk Thresholds

Modify risk categories in the prediction function:

```python
def categorize_risk(prob):
    if prob < 0.30: return 'Low Risk', '🟢'
    elif prob < 0.60: return 'Moderate Risk', '🟡'
    elif prob < 0.85: return 'High Risk', '🟠'
    else: return 'Very High Risk', '🔴'
```

## 📈 Performance Metrics

The system tracks:
- **Accuracy**: Overall prediction correctness
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **ROC-AUC**: Area under the ROC curve

View detailed metrics in the Analytics dashboard.

## 🛠️ Development

### Running Analysis Script

```bash
python run_analysis.py
```

This generates model performance reports and evaluation metrics.

### Jupyter Notebook

Open the analysis notebook:

```bash
jupyter notebook Analysis.ipynb
```

## ⚠️ Important Notes

> **Medical Disclaimer**: This system is for **research and clinical decision support only**. It is NOT a substitute for professional medical diagnosis. Always consult qualified healthcare professionals for medical decisions.

- Results should be validated with additional clinical tests
- Model accuracy depends on training data quality
- Regular model retraining recommended with new data
- Ensure patient data privacy and HIPAA compliance

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Streamlit](https://streamlit.io/)
- Machine Learning powered by [Scikit-learn](https://scikit-learn.org/) and [XGBoost](https://xgboost.readthedocs.io/)
- Visualizations using [Plotly](https://plotly.com/)

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## 🔄 Version History

- **v1.0** (Current) - Initial release
  - Multi-model ensemble learning
  - Interactive web interface
  - Batch prediction support
  - Analytics dashboard

---

**Built with ❤️ for Healthcare Innovation**

*Powered by Advanced Machine Learning | Streamlit Web Application*
