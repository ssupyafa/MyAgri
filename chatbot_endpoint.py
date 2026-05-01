import os
import requests
from flask import request, jsonify

def add_chatbot_endpoint(app):
    GEMINI_API_KEY = "AIzaSyA1Wf-zpbwb2q79FQ0Cuh2R8sxwf6Notho"
    GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY

    @app.route('/api/chat', methods=['POST'])
    def chat():
        data = request.get_json()
        user_message = data.get('message', '')
        if not user_message:
            return jsonify({"response": "Please enter a message."})
        payload = {
            "contents": [{"parts": [{"text": user_message}]}]
        }
        try:
            response = requests.post(GEMINI_API_URL, json=payload)
            if response.status_code == 200:
                gemini_response = response.json()
                text = gemini_response['candidates'][0]['content']['parts'][0]['text']
                return jsonify({"response": text})
            else:
                print("Gemini API error:", response.text)
                return jsonify({"response": "Sorry, Gemini API error."})
        except Exception as e:
            print("Exception:", e)
            return jsonify({"response": "Sorry, there was an error."})