import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from pathlib import Path

# Path to the pre-trained model that is already present in your project
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Models", "Disease_prediction", "best_plant_disease_model.h5"))

# Load the pre-trained model
print(f"Loading pre-trained model from {MODEL_PATH}...")
model = tf.keras.models.load_model(MODEL_PATH)

# Note: The model might need to have its metrics compiled.
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
print("Model loaded successfully!")

def predict_image(img_path):
    print(f"Analyzing {img_path}...")
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0  # Rescale like in training

        predictions = model.predict(img_array)
        class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0])) * 100
        
        print(f"Prediction Output:")
        print(f" - Predicted Class Index: {class_idx}")
        print(f" - Confidence: {confidence:.2f}%")
        return class_idx, confidence
    except Exception as e:
        print(f"Error predicting image: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        predict_image(sys.argv[1])
    else:
        # Create a dummy green image just to test the model dynamically
        from PIL import Image
        dummy_img = Image.new('RGB', (224, 224), color = 'green')
        dummy_path = 'dummy_leaf.jpg'
        dummy_img.save(dummy_path)
        print("No image provided. Created a dummy green image 'dummy_leaf.jpg' for testing.")
        predict_image(dummy_path)
        os.remove(dummy_path)
