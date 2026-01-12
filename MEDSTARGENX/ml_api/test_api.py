"""
Debug script to test the ML API with a sample CSV
"""

import requests
import pandas as pd
import io

# Create a test CSV with just a few rows from the training data
test_data = {
    'Sample_ID': ['TEST_001', 'TEST_002'],
    'Ct_JAK2_V617F': [26.49, 24.59],
    'Ct_microRNA_155': [21.3, 22.24],
    'Ct_HLA_Tcell': [28.22, 27.99],
    'Ct_REF_GAPDH': [17.03, 18.42],
    'Hb': [14.06, 17.03],
    'RBC': [5.06, 4.96],
    'WBC': [8.2, 9.41],
    'Platelet': [325.61, 389.24],
    'Drug_Resistance_Index': [0.32, 0.9],
    'ΔCt_JAK2': [9.46, 6.17]  # Using Delta symbol like in your CSV
}

df = pd.DataFrame(test_data)

# Save to CSV
csv_string = df.to_csv(index=False)
print("Test CSV content:")
print(csv_string)
print("\n" + "="*60)

# Test the API
print("\n🧪 Testing ML API...")
try:
    files = {'file': ('test.csv', io.StringIO(csv_string), 'text/csv')}
    response = requests.post('http://localhost:5001/api/predict', files=files)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("\n✅ API is working!")
        data = response.json()
        if data['success']:
            print(f"✅ Got {len(data['patients'])} predictions")
            for patient in data['patients']:
                print(f"  - {patient['id']}: {patient['riskScore']}% ({patient['status']})")
    else:
        print(f"\n❌ API Error: {response.json()}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
