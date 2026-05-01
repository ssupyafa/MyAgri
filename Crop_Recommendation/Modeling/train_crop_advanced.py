import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train_crop_model():
    csv_path = "/Users/yaphetesayas/Desktop/DigitalAgricultureUpdate/Crop_Recommendation/Modeling/crop_data_v2.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return
    df = pd.read_csv(csv_path)
    X = df.drop('label', axis=1)
    y = df['label']
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    label_map = dict(zip(range(len(le.classes_)), le.classes_))
    print(f"Classes: {le.classes_}")

    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)
    rf = RandomForestClassifier(random_state=42)
    et = ExtraTreesClassifier(random_state=42)
    param_dist = {
        'rf__n_estimators': [100, 200],
        'rf__max_depth': [None, 10, 20],
        'et__n_estimators': [100, 200],
        'et__max_depth': [None, 10, 20]
    }
    voting_clf = VotingClassifier(
        estimators=[('rf', rf), ('et', et)],
        voting='soft'
    )
    print("Optimization in progress (Randomized Search)...")
    random_search = RandomizedSearchCV(voting_clf, param_distributions=param_dist, n_iter=5, cv=3, random_state=42, verbose=1)
    random_search.fit(X_train, y_train)
    best_model = random_search.best_estimator_
    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Overall Accuracy: {accuracy*100:.2f}%")
    y_proba = best_model.predict_proba(X_test)
    top3_acc = 0
    for i in range(len(y_test)):
        top3_indices = np.argsort(y_proba[i])[-3:]
        if y_test[i] in top3_indices:
            top3_acc += 1
    print(f"Top-3 Accuracy: {top3_acc/len(y_test)*100:.2f}%")

    model_dir = "/Users/yaphetesayas/Desktop/DigitalAgricultureUpdate/Models/Crop Recommendation"
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    model_path = os.path.join(model_dir, "model_v2.pkl")
    export_data = {
        "model": best_model,
        "label_map": label_map,
        "features": list(X.columns)
    }
    joblib.dump(export_data, model_path)
    print(f"Advanced Model saved to {model_path}")

if __name__ == "__main__":
    train_crop_model()