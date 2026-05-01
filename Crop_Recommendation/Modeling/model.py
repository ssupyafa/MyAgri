import joblib
import os

class CropRecommendation():
    def predict_top_n(self, inputs:dict, n=3):
        float_columns = ["N","P","K","temperature","humidity","ph","rainfall"]
        values = []
        for col in float_columns:
            val = inputs.get(col)
            if val is None:
                return False
            if isinstance(val, (list, tuple)):
                values.append(float(val[0]))
            else:
                values.append(float(val))
        proba = self.model.predict_proba([values])[0]
        if hasattr(self.model, 'classes_'):
            classes = self.model.classes_
            top_n = sorted(enumerate(proba), key=lambda x: x[1], reverse=True)[:n]
            return [(self.label_map.get(classes[i], classes[i]), float(p)) for i, p in top_n]
        else:
            top_n = sorted(enumerate(proba), key=lambda x: x[1], reverse=True)[:n]
            return [(self.label_map.get(i, i), float(p)) for i, p in top_n]
    def __init__(self, model_name:str):
        self.model_name = model_name
        pass
    def get_features():
        features = ["N","P","K","temperature","humidity","ph","rainfall"]
        return features
    def load_model(self):
        print(f"Loading Crop Model from: {self.model_name}")
        loaded = joblib.load(self.model_name)
        if isinstance(loaded, dict):
            self.model = loaded.get("model", loaded)
            self.label_map = loaded.get("label_map", {})
            self.features = loaded.get("features", ["N","P","K","temperature","humidity","ph","rainfall"])
        else:
            self.model = loaded
            self.label_map = {
                0: 'apple', 1: 'banana', 2: 'blackgram', 3: 'chickpea', 4: 'coconut', 5: 'coffee',
                6: 'cotton', 7: 'grapes', 8: 'jute', 9: 'kidneybeans', 10: 'lentil', 11: 'maize',
                12: 'mango', 13: 'mothbeans', 14: 'mungbean', 15: 'muskmelon', 16: 'orange',
                17: 'papaya', 18: 'pigeonpeas', 19: 'pomegranate', 20: 'rice', 21: 'watermelon'
            }
    def predict(self, inputs:dict):
        float_columns = ["N","P","K","temperature","humidity","ph","rainfall"]
        values = []
        for col in float_columns:
            val = inputs.get(col)
            if val is None:
                return False
            if isinstance(val, (list, tuple)):
                values.append(float(val[0]))
            else:
                values.append(float(val))
        prediction = self.model.predict([values])[0]
        return self.label_map.get(prediction, prediction)
recommendor = CropRecommendation(os.path.join(os.path.abspath(os.path.dirname(__file__)), "../../Models/Crop Recommendation/model_v2.pkl"))
recommendor.load_model()