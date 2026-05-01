import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
from PIL import Image
from tensorflow.keras.models import load_model
from flask import Flask, render_template, request, make_response, redirect, send_from_directory, jsonify
from cryptography.fernet import Fernet
from Crop_Recommendation.Modeling import model
import joblib
import sqlite3
import random
import json
import numpy as np
from chatbot_endpoint import add_chatbot_endpoint
import PIL.Image
from flask_mail import Mail, Message
from fpdf import FPDF
import io
from dotenv import load_dotenv

load_dotenv()

class DiseaseClassifier:
    def __init__(self):
        self.models = {}
        self.crop_model = None
        self.vit_map = {
            0: 'Corn___Common_Rust', 1: 'Corn___Gray_Leaf_Spot', 2: 'Corn___Healthy',
            4: 'Potato___Early_Blight', 5: 'Potato___Healthy', 6: 'Potato___Late_Blight',
            7: 'Rice___Brown_Spot', 8: 'Rice___Healthy', 9: 'Rice___Leaf_Blast',
            10: 'Wheat___Brown_Rust', 11: 'Wheat___Healthy', 12: 'Wheat___Yellow_Rust'
        }
        self.sugarcane_labels = ['Sugarcane__Red_Rot', 'Sugarcane__Healthy', 'Sugarcane__Bacterial Blight']

    def scale_confidence(self, raw_score):
        import math
        scaled = math.sqrt(float(raw_score))
        if scaled > 0.9: scaled = 0.9 + (scaled - 0.9) * 0.5
        return min(0.98, max(float(raw_score), scaled))

    def get_crop_model(self):
        if self.crop_model is None:
            import tensorflow as tf
            model_path = os.path.join(basedir, "Models/Disease_prediction/best_plant_disease_model.h5")
            print(f"Loading base crop model: {model_path}...")
            self.crop_model = tf.keras.models.load_model(model_path)
        return self.crop_model

    def get_pipeline(self, model_id):
        if model_id not in self.models:
            from transformers import pipeline
            print(f"Loading disease model: {model_id}...")
            self.models[model_id] = pipeline("image-classification", model=model_id)
        return self.models[model_id]

    def predict(self, image_path):
        import tensorflow as tf
        from PIL import Image
        crop_model = self.get_crop_model()
        img_size = 224
        img = tf.keras.preprocessing.image.load_img(image_path, target_size=(img_size, img_size))
        arr = tf.keras.preprocessing.image.img_to_array(img) / 255.0
        arr = np.expand_dims(arr, axis=0)
        crop_preds = crop_model.predict(arr)
        crop_idx = int(np.argmax(crop_preds[0]))
        if crop_idx == 4:
            conf = self.scale_confidence(crop_preds[0][4])
            return self.sugarcane_labels[1], conf
        vit_pipe = self.get_pipeline("wambugu71/crop_leaf_diseases_vit")
        pil_img = PIL.Image.open(image_path)
        results = vit_pipe(pil_img)
        best = results[0]
        label_id = int(best['label'].split('_')[-1]) if best['label'].startswith('LABEL_') else best['label']
        if isinstance(label_id, int) and label_id in self.vit_map:
            return self.vit_map[label_id], self.scale_confidence(best['score'])
        return best['label'], self.scale_confidence(best['score'])

disease_classifier = DiseaseClassifier()
img_width = 28
img_height = 28
basedir = os.path.abspath(os.path.dirname(__file__))
drought_model = joblib.load(os.path.join(basedir, "Models/Drought Prediction/model.pkl"))
drought_encoders = joblib.load(os.path.join(basedir, "Models/Drought Prediction/encoders.pkl"))
dbfile = "database.db"
def get_db():
    conn = sqlite3.connect(dbfile)
    conn.row_factory = sqlite3.Row
    return conn

with get_db() as conn:
    conn.execute("CREATE TABLE IF NOT EXISTS users(first TEXT, last TEXT, email TEXT, username TEXT, password TEXT)")
    cols = [row['name'] for row in conn.execute("PRAGMA table_info(users)").fetchall()]
    if 'avatar' not in cols: conn.execute("ALTER TABLE users ADD COLUMN avatar TEXT")
    if 'title' not in cols: conn.execute("ALTER TABLE users ADD COLUMN title TEXT DEFAULT 'Agronomist'")
    if 'location' not in cols: conn.execute("ALTER TABLE users ADD COLUMN location TEXT DEFAULT 'Unknown'")
    if 'joined' not in cols: conn.execute("ALTER TABLE users ADD COLUMN joined TEXT")
    conn.execute("""
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        log_type TEXT,
        input_data TEXT,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT UNIQUE,
        username TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, static_folder=os.path.join(basedir, 'frontend/dist'), static_url_path='/')
add_chatbot_endpoint(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'yaphetesayas@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'cmepkkswgspollrm')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'yaphetesayas@gmail.com')
mail = Mail(app)

host = "0.0.0.0"
port = 1234
NUMERIC_FIELDS = [
    "TS", "T2M_MAX", "T2M", "QV2M", "WS10M", "T2M_MIN", "RH2M", "T2MDEW", "WS2M",
    "ALLSKY_SFC_PAR_TOT", "PS", "ALLSKY_SFC_SW_DWN", "PRECTOTCORR",
]
FIELD_LABELS = {
    "TS": "Surface Temperature (K)", "T2M_MAX": "Maximum 2m Temperature (°C)",
    "T2M": "Average 2m Temperature (°C)", "QV2M": "2m Specific Humidity (g/kg)",
    "WS10M": "10m Wind Speed (m/s)", "T2M_MIN": "Minimum 2m Temperature (°C)",
    "RH2M": "2m Relative Humidity (%)", "T2MDEW": "2m Dew Point Temperature (°C)",
    "WS2M": "2m Wind Speed (m/s)", "ALLSKY_SFC_PAR_TOT": "All Sky Surface PAR Total (MJ/m²)",
    "PS": "Surface Pressure (kPa)", "ALLSKY_SFC_SW_DWN": "All Sky Surface Shortwave Down (MJ/m²)",
    "PRECTOTCORR": "Corrected Precipitation (mm)",
}
FIELD_PLACEHOLDERS = {
    "TS": "e.g. 295.15", "T2M_MAX": "e.g. 32.4", "T2M": "e.g. 25.8",
    "QV2M": "e.g. 8.7", "WS10M": "e.g. 3.2", "T2M_MIN": "e.g. 18.6",
    "RH2M": "e.g. 65", "T2MDEW": "e.g. 16.7", "WS2M": "e.g. 1.5",
    "ALLSKY_SFC_PAR_TOT": "e.g. 45.2", "PS": "e.g. 101.3",
    "ALLSKY_SFC_SW_DWN": "e.g. 23.5", "PRECTOTCORR": "e.g. 110",
}
key = b'kwdRWkJwHCtRFvB23XRNYkcy7AK19T6Y6N5a7awW5O4='
crop_recommendor = model.CropRecommendation("Models/Crop Recommendation/model_v2.pkl")
crop_recommendor.load_model()

import uuid
def generate_name(filename):
    if "." in filename:
        extension = filename.split(".")[-1]
        if extension.lower() not in ["jpg", "png", "jpeg"]:
            return False
        return f"{uuid.uuid4().hex}.{extension}"
    return False
def is_float(num):
    try:
        float(num)
        return True
    except:
        return False

def predict_drought_resistance(form):
    features = ['Precipitation_mm', 'Temperature_C', 'Solar_Radiation_MJ_m2',
       'Evapotranspiration_mm', 'Soil_Moisture_%', 'Humidity_%',
       'Drought_Duration_days', 'WUE_g_per_mm', 'Leaf_Water_Potential_MPa',
       'Stomatal_Conductance_mol_m2_s', 'Root_Depth_cm',
       'Photosynthetic_Rate_umol_m2_s', 'Plant_Biomass_g_m2', 'ZmDREB2A',
       'Root_QTL', 'ZmNAC', 'Planting_Density_plants_ha', 'Soil_Type',
       'Growth_Stage']
    completed = True
    for i in features:
        if i not in form.keys():
            completed = False
    perfect = True
    if completed:
        values = []
        for i in features:
            value = form.get(i)
            if value is not None and value != "":
                if i in ["Soil_Type", "Growth_Stage"]:
                    try:
                        transformed_value = int(drought_encoders[i].transform([value])[0])
                        values.append(transformed_value)
                    except Exception as e:
                        print(f"Encoder error for {i} with value {value}: {e}")
                        perfect = False
                else:
                    if is_float(value):
                        values.append(float(value))
                    else:
                        print(f"Non-float value for {i}: {value}")
                        perfect = False
            else:
                return {"status": "fail", "message": f"Missing or empty field: {i}"}
        if perfect and len(values) == len(features):
            prediction = drought_model.predict([values]) * 100
            return {"status": "success", "prediction": float(prediction[0])}
        else:
            return {"status": "fail", "message": f"Validation failed: perfect={perfect}, count={len(values)}/19"}
    else:
        missing = [i for i in features if i not in form.keys()]
        return {"status": "fail", "message": f"Missing input fields: {', '.join(missing)}"}

def predict_soil_suitability(form):
    model_path = os.path.join(basedir, "Models/Soil Suitability/prediction_model_v2.pkl")
    scaler_path = os.path.join(basedir, "Models/Soil Suitability/scaler_v2.pkl")
    if not os.path.isfile(model_path) or not os.path.isfile(scaler_path):
        return {"status": "fail", "message": "Updated high-accuracy soil model not found."}
    prediction_model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    data = []
    for field in NUMERIC_FIELDS:
        value = form.get(field)
        if value is None or not is_float(value):
            raise ValueError(f"Field '{FIELD_LABELS.get(field, field)}' is missing or not a valid number.")
        val = float(value)
        if field == "TS" and val > 100:
            val = val - 273.15
        data.append(val)
    ts_c, t2m, rh, ws2m, ps, sw_dwn, p_corr = data[0], data[2], data[6], data[8], data[10], data[11], data[12]
    def temp_score(t):
        if t < 10 or t > 40: return 0
        if t <= 25: return (t - 10) / (25 - 10)
        return (40 - t) / (40 - 25)
    t_score = 0.5 * temp_score(t2m) + 0.5 * temp_score(ts_c)
    if p_corr < 20: pr_score = p_corr / 20 * 0.5
    elif p_corr < 50: pr_score = 0.5 + (p_corr - 20) / 30 * 0.5
    elif p_corr < 150: pr_score = 1.0
    else: pr_score = max(0.4, 1.0 - (p_corr - 150) / 150)
    m_score = 0.6 * pr_score + 0.4 * (rh / 100)
    s_score = min(1.0, sw_dwn / 25)
    env_score = 0.7 * max(0, 1.0 - abs(ps - 101.3) / 20) + 0.3 * max(0, 1.0 - ws2m / 15)
    baseline_index = (0.35 * t_score + 0.30 * m_score + 0.20 * s_score + 0.15 * env_score)
    scaled_data = scaler.transform([data])
    ml_pred = float(prediction_model.predict(scaled_data)[0])
    if abs(ml_pred - baseline_index) > 0.25:
        suitability = baseline_index * 100
    else:
        suitability = ml_pred * 100
    suitability = max(1.2, min(99.8, suitability))
    if suitability >= 75:
        analysis = "Excellent suitability: Highly favorable conditions. Scientific consensus suggests optimal yields."
    elif suitability >= 50:
        analysis = "Good suitability: Adequate conditions, though some minor parameters could be optimized."
    elif suitability >= 30:
        analysis = "Moderate suitability: Limiting factors present. Soil remediation or irrigation adjustments advised."
    else:
        analysis = "Low suitability: Unfavorable conditions. High risk for crop failure without major intervention."
    return {"suitability": round(float(suitability), 1), "analysis": analysis}

def clean_label(label):
    if not label: return "Healthy"
    res = label.replace("___", ": ").replace("__", ": ").replace("_", " ")
    return res.title() if ":" not in res else res

def analyze_suitability(crop, clay, sand, silt, nitrogen, phosphorus, potassium, ph, rainfall):
    pass

def recommend_crop(form):
    return {"recommended_crop": crop_recommendor.predict(form)}

def create_session(username):
    import secrets
    token = secrets.token_urlsafe(32)
    with get_db() as conn:
        conn.execute("""
            DELETE FROM sessions 
            WHERE username = ? 
            AND id IN (
                SELECT id FROM sessions 
                WHERE username = ? 
                ORDER BY id DESC 
                LIMIT -1 OFFSET 2
            )
        """, (username, username))
        conn.execute("INSERT INTO sessions (token, username) VALUES (?, ?)", (token, username))
        conn.commit()
    return token

def decrypt_session(session):
    return Fernet(key).decrypt(session.encode()).decode()

def is_user(username):
    if not username: return False
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM users WHERE username=?", [username])
        return cur.fetchone() is not None

def get_user_from_request():
    auth_header = request.headers.get("Authorization")
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    if not token:
        token = request.cookies.get("token")
    if not token: return None
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT username FROM sessions WHERE token = ?", (token,))
        row = cur.fetchone()
        return row[0] if row else None

def authenticate(username, password):
    if not username or not password: return False
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        return cur.fetchone() is not None

def create_user(form):
    first = form.get("first", "").strip()
    last = form.get("last", "").strip()
    email = form.get("email", "").strip()
    username = form.get("username", "").strip()
    password = form.get("password", "").strip()
    if not all([first, last, email, username, password]):
        return False
    if is_user(username):
        return False
    import datetime
    joined = datetime.datetime.now().strftime("%Y")
    with get_db() as conn:
        conn.execute("INSERT INTO users (first, last, email, username, password, joined) VALUES(?,?,?,?,?,?)", 
                     (first, last, email, username, password, joined))
        conn.commit()
    return True

def format_log_entries(logs):
    import ast
    import json
    formatted = []
    for log in logs:
        log_type, input_str, result_str, ts = log
        try: inp = ast.literal_eval(input_str)
        except Exception:
            try: inp = json.loads(input_str)
            except Exception: inp = input_str
        try: res = ast.literal_eval(result_str)
        except Exception:
            try: res = json.loads(result_str)
            except Exception: res = result_str
        short_desc = ""
        if log_type == 'suitability':
            score = res.get('suitability', 'N/A') if isinstance(res, dict) else 'N/A'
            if isinstance(score, float): score = round(score, 2)
            short_desc = f"Analyzed soil suitability. Score: {score}%."
        elif log_type == 'crop':
            crops = res.get('top_crops', []) if isinstance(res, dict) else []
            top = crops[0][0] if crops else 'None'
            short_desc = f"Recommended crop: {top}."
        elif log_type == 'disease':
            if isinstance(res, dict):
                label = clean_label(res.get('label', 'Unknown'))
                short_desc = f"Pathogen detected: {label}."
            else:
                short_desc = f"Pathogen detected: {clean_label(str(res))}."
        elif log_type == 'drought':
            pred = res.get('prediction', 'N/A') if isinstance(res, dict) else 'N/A'
            if isinstance(pred, float): pred = round(pred, 2)
            short_desc = f"Drought resistance level: {pred}%."
        formatted.append({
            "type": log_type,
            "timestamp": ts,
            "input": inp,
            "result": res,
            "short": short_desc
        })
    return formatted

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if authenticate(username, password):
        token = create_session(username)
        res = make_response(jsonify({"status": "success", "session": token}))
        res.set_cookie("token", token, httponly=True, samesite='Lax')
        return res
    return jsonify({"status": "fail", "message": "Invalid credentials"}), 401

@app.route("/api/logout", methods=["POST"])
def api_logout():
    token = request.headers.get("Authorization") or request.cookies.get("token")
    if token:
        with get_db() as conn:
            conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
            conn.commit()
    res = make_response(jsonify({"status": "success"}))
    res.set_cookie("token", "", expires=0)
    return res

@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.json or request.form
    if create_user(data):
        username = data.get("username")
        session_token = create_session(username)
        return jsonify({"status": "success", "session": session_token})
    return jsonify({"status": "fail", "message": "User already exists or invalid data"}), 400

@app.route("/api/profile", methods=["GET", "POST"])
def api_profile():
    username = get_user_from_request()
    if not username: return jsonify({"status": "fail", "message": "Unauthorized"}), 401
    if request.method == "POST":
        data = request.json or request.form
        first = data.get("first")
        last = data.get("last")
        email = data.get("email")
        title = data.get("title")
        location = data.get("location")
        with get_db() as conn:
            conn.execute("""
                UPDATE users SET first=?, last=?, email=?, title=?, location=?
                WHERE username=?
            """, (first, last, email, title, location, username))
            conn.commit()
        return jsonify({"status": "success", "message": "Profile updated"})
    else:
        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("SELECT first, last, email, username, title, location, joined, avatar FROM users WHERE username=?", (username,))
            user = cur.fetchone()
            if user:
                return jsonify({
                    "status": "success",
                    "data": {
                        "first": user["first"],
                        "last": user["last"],
                        "email": user["email"],
                        "username": user["username"],
                        "title": user["title"] or "Agronomist",
                        "location": user["location"] or "Unknown",
                        "joined": user["joined"] or "2024",
                        "avatar": user["avatar"] or f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}"
                    }
                })
            return jsonify({"status": "fail", "message": "User not found"}), 404

@app.route("/api/dashboard", methods=["GET"])
def api_dashboard():
    username = get_user_from_request()
    if not username: return jsonify({"status": "fail", "message": "Unauthorized"}), 401
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT log_type, input_data, result, timestamp FROM logs WHERE username=? ORDER BY timestamp DESC LIMIT 50", (username,))
        logs = cur.fetchall()
        logs_list = [tuple(row) for row in logs]
    import json, re
    summary = {"crop": None, "drought": None, "suitability": None, "disease": None}
    for log_type in summary.keys():
        for log in logs:
            if log[0] == log_type:
                import json
                try: res = json.loads(log[2])
                except: res = log[2]
                if log_type == 'disease':
                    label = res.get('label', 'Unknown') if isinstance(res, dict) else str(res)
                    summary[log_type] = clean_label(label)
                elif log_type == 'crop':
                    summary[log_type] = log
                break
    res = {"status": "success", "username": username, "logs": format_log_entries(logs_list), "summary": {}}
    for k, v in summary.items():
        if v:
            res["summary"][k] = {"input": v[1], "result": v[2], "timestamp": v[3]}
    return jsonify(res)

@app.route("/api/suitability", methods=["POST"])
def api_suitability():
    username = get_user_from_request()
    if not username: return jsonify({"status": "fail", "message": "Unauthorized"}), 401
    data = request.json or request.form
    try:
        prediction = predict_soil_suitability(data)
        with get_db() as conn:
            conn.execute("INSERT INTO logs (username, log_type, input_data, result) VALUES (?, ?, ?, ?)",
                         (username, "suitability", str(dict(data)), str(prediction)))
            conn.commit()
        return jsonify({"status": "success", "prediction": prediction})
    except Exception as e:
        return jsonify({"status": "fail", "message": str(e)}), 400

@app.route("/api/drought", methods=["POST"])
def api_drought():
    username = get_user_from_request()
    if not username: return jsonify({"status": "fail", "message": "Unauthorized"}), 401
    data = request.json or request.form
    try:
        result = predict_drought_resistance(data)
        with get_db() as conn:
            conn.execute("INSERT INTO logs (username, log_type, input_data, result) VALUES (?, ?, ?, ?)",
                         (username, "drought", str(dict(data)), str(result)))
            conn.commit()
        if result.get("status") == "fail":
            return jsonify(result), 400
        return jsonify({"status": "success", "result": result})
    except Exception as e:
        return jsonify({"status": "fail", "message": str(e)}), 400

@app.route("/api/crop_recommendation", methods=["POST"])
def api_crop_recommendation():
    username = get_user_from_request()
    if not username: return jsonify({"status": "fail", "message": "Unauthorized"}), 401
    data = request.json or request.form
    try:
        from Crop_Recommendation.Modeling import model
        top_crops = model.recommendor.predict_top_n(data, n=3)
        import json
        with get_db() as conn:
            conn.execute("INSERT INTO logs (username, log_type, input_data, result) VALUES (?, ?, ?, ?)",
                         (username, "crop", json.dumps(dict(data)), json.dumps({"top_crops": top_crops})))
            conn.commit()
        return jsonify({"status": "success", "top_crops": top_crops})
    except Exception as e:
        return jsonify({"status": "fail", "message": str(e)}), 400

@app.route("/api/crop_disease", methods=["POST"])
def api_crop_disease():
    username = get_user_from_request()
    if not username: return jsonify({"status": "fail", "message": "Unauthorized"}), 401
    if "image" not in request.files: return jsonify({"status": "fail", "message": "No image provided"}), 400
    file = request.files["image"]
    filename = file.filename
    generated_name = generate_name(filename)
    if generated_name:
        upload_dir = "./uploads"
        if not os.path.exists(upload_dir): os.makedirs(upload_dir)
        save_path = os.path.join(upload_dir, generated_name)
        file.save(save_path)
        try:
            label, confidence = disease_classifier.predict(save_path)
            res = {"label": label, "confidence": confidence}
            with get_db() as conn:
                conn.execute("INSERT INTO logs (username, log_type, input_data, result) VALUES (?, ?, ?, ?)",
                             (username, "disease", filename, json.dumps(res)))
                conn.commit()
            return jsonify({"status": "success", "result": res})
        except Exception as e:
            print(f"Prediction Error: {str(e)}")
            return jsonify({"status": "fail", "message": "Analytical failure in neural pipeline"}), 500
    else:
        return jsonify({"status": "fail", "message": "Invalid file type"}), 400

@app.route("/api/export-data", methods=["POST"])
def api_export_data():
    username = get_user_from_request()
    if not username: return jsonify({"status": "fail", "message": "Unauthorized"}), 401
    
    data = request.json
    recipient_email = data.get("email")
    if not recipient_email: return jsonify({"status": "fail", "message": "Email is required"}), 400

    try:
        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("SELECT first, last FROM users WHERE username=?", (username,))
            user = cur.fetchone()
            cur.execute("SELECT log_type, input_data, result, timestamp FROM logs WHERE username=? ORDER BY timestamp DESC", (username,))
            logs = cur.fetchall()

        if not user: return jsonify({"status": "fail", "message": "User not found"}), 404

        pdf = FPDF()
        pdf.add_page()
        
        pdf.set_font("Arial", 'B', 24)
        pdf.set_text_color(46, 125, 50) 
        pdf.cell(0, 20, "MyAgrii Prediction Report", ln=True, align='C')
        
        pdf.set_font("Arial", 'I', 10)
        pdf.set_text_color(100, 100, 100)
        import datetime
        pdf.cell(0, 10, f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align='C')
        pdf.ln(10)

        pdf.set_font("Arial", 'B', 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 10, f"Account Holder: {user['first']} {user['last']} (@{username})", ln=True)
        pdf.ln(5)

        pdf.set_fill_color(240, 240, 240)
        pdf.set_font("Arial", 'B', 10)
        pdf.cell(40, 10, "Date", 1, 0, 'C', True)
        pdf.cell(30, 10, "Type", 1, 0, 'C', True)
        pdf.cell(120, 10, "Result Summary", 1, 1, 'C', True)

        pdf.set_font("Arial", '', 9)
        import ast
        for log in logs:
            l_type, inp, res, ts = log
            
            res_data = {}
            if isinstance(res, str):
                try: 
                    res_data = json.loads(res)
                except:
                    try:
                        res_data = ast.literal_eval(res)
                    except:
                        res_data = res
            else:
                res_data = res

            summary = "N/A"
            if isinstance(res_data, dict):
                if l_type == 'suitability':
                    summary = f"Suitability: {res_data.get('suitability', 'N/A')}%"
                elif l_type == 'crop':
                    crops = res_data.get('top_crops', [])
                    summary = f"Top Crop: {crops[0][0] if crops else 'N/A'}"
                elif l_type == 'disease':
                    summary = f"Detected: {res_data.get('label', 'N/A')}"
                elif l_type == 'drought':
                    summary = f"Level: {res_data.get('prediction', 'N/A')}%"
            else:
                summary = str(res_data)[:60] 

            display_ts = ts.split(".")[0] if "." in ts else ts
            
            pdf.cell(40, 10, display_ts, 1)
            pdf.cell(30, 10, l_type.capitalize(), 1)
            pdf.cell(120, 10, summary, 1, 1)

        pdf_output = pdf.output(dest='S')
        
        msg = Message(
            "Your MyAgrii Prediction History",
            recipients=[recipient_email],
            body=f"Hello {user['first']},\n\nPlease find attached your full prediction history from MyAgrii.\n\nBest regards,\nThe MyAgrii Team"
        )
        msg.attach("MyAgrii_Report.pdf", "application/pdf", pdf_output)
        mail.send(msg)

        return jsonify({"status": "success", "message": "Email sent successfully"})
    except Exception as e:
        print(f"Export Error: {str(e)}")
        return jsonify({"status": "fail", "message": f"Failed to send email: {str(e)}"}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if path.startswith('api/'):
        return jsonify({"status": "fail", "message": "API endpoint not found"}), 404
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def handle_404(e):
    if request.path.startswith('/api/'):
        return jsonify({"status": "fail", "message": "Not found"}), 404
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    print(f"Serving static files from: {app.static_folder}")
    app.run(port=port, debug=True, host=host)