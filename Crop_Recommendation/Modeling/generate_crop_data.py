import pandas as pd
import numpy as np
import os

def generate_crop_data(num_samples_per_crop=100):
    np.random.seed(42)
    crops = [
        'apple', 'banana', 'blackgram', 'chickpea', 'coconut', 'coffee',
        'cotton', 'grapes', 'jute', 'kidneybeans', 'lentil', 'maize',
        'mango', 'mothbeans', 'mungbean', 'muskmelon', 'orange',
        'papaya', 'pigeonpeas', 'pomegranate', 'rice', 'watermelon'
    ]
    data = []
    crop_params = {
        'rice': [[60, 100], [35, 60], [35, 45], [20, 27], [80, 85], [6.0, 7.0], [200, 300]],
        'maize': [[60, 100], [35, 60], [15, 25], [20, 30], [55, 75], [5.5, 7.0], [60, 110]],
        'chickpea': [[20, 60], [55, 85], [75, 85], [17, 21], [15, 20], [7.0, 8.5], [65, 95]],
        'kidneybeans': [[0, 40], [55, 80], [15, 25], [15, 25], [18, 25], [5.5, 6.0], [60, 150]],
        'pigeonpeas': [[0, 40], [55, 80], [15, 25], [18, 37], [30, 70], [4.5, 7.5], [90, 190]],
        'mothbeans': [[0, 40], [35, 60], [15, 25], [24, 30], [40, 65], [6.5, 10.0], [30, 75]],
        'mungbean': [[0, 40], [35, 60], [15, 25], [27, 30], [80, 90], [6.2, 7.2], [35, 60]],
        'blackgram': [[20, 60], [55, 80], [15, 25], [25, 35], [60, 75], [6.5, 7.5], [60, 75]],
        'lentil': [[0, 40], [55, 80], [15, 25], [18, 30], [60, 70], [5.9, 7.8], [35, 55]],
        'pomegranate': [[0, 40], [5, 30], [35, 45], [18, 25], [85, 95], [5.5, 7.5], [100, 115]],
        'banana': [[80, 120], [75, 95], [45, 55], [25, 29], [75, 85], [5.5, 6.5], [90, 115]],
        'mango': [[0, 40], [15, 40], [25, 35], [27, 36], [45, 55], [4.5, 7.0], [90, 105]],
        'grapes': [[0, 40], [120, 145], [195, 205], [8, 42], [80, 85], [5.5, 6.5], [65, 75]],
        'watermelon': [[80, 120], [5, 30], [45, 55], [24, 27], [80, 90], [6.0, 7.0], [40, 60]],
        'muskmelon': [[80, 120], [5, 30], [45, 55], [27, 30], [90, 100], [6.0, 7.0], [20, 30]],
        'apple': [[0, 40], [120, 145], [195, 205], [21, 24], [90, 95], [5.5, 6.5], [100, 125]],
        'orange': [[0, 40], [5, 30], [5, 15], [23, 35], [90, 95], [6.0, 8.0], [100, 120]],
        'papaya': [[30, 70], [45, 70], [45, 55], [23, 44], [90, 95], [6.5, 7.0], [230, 255]],
        'coconut': [[0, 40], [5, 30], [25, 35], [25, 30], [90, 100], [5.5, 6.5], [130, 230]],
        'cotton': [[100, 140], [35, 60], [15, 25], [22, 26], [75, 85], [7.0, 8.0], [60, 100]],
        'jute': [[60, 100], [35, 60], [35, 45], [23, 27], [70, 90], [6.0, 7.5], [150, 200]],
        'coffee': [[80, 120], [15, 40], [25, 35], [23, 28], [50, 70], [6.0, 7.5], [140, 200]],
    }
    for crop in crops:
        params = crop_params[crop]
        for _ in range(num_samples_per_crop):
            row = {
                'N': np.random.uniform(params[0][0], params[0][1]),
                'P': np.random.uniform(params[1][0], params[1][1]),
                'K': np.random.uniform(params[2][0], params[2][1]),
                'temperature': np.random.uniform(params[3][0], params[3][1]),
                'humidity': np.random.uniform(params[4][0], params[4][1]),
                'ph': np.random.uniform(params[5][0], params[5][1]),
                'rainfall': np.random.uniform(params[6][0], params[6][1]),
                'label': crop
            }
            for feature in ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']:
                row[feature] += np.random.normal(0, row[feature] * 0.02)
            data.append(row)
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    out_dir = "/Users/yaphetesayas/Desktop/DigitalAgricultureUpdate/Crop_Recommendation/Modeling"
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)
    print("Generating high-fidelity crop data...")
    df = generate_crop_data(200)
    csv_path = os.path.join(out_dir, "crop_data_v2.csv")
    df.to_csv(csv_path, index=False)
    print(f"Data saved to {csv_path}. Total rows: {len(df)}")