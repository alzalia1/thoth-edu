# backend.py
from flask import Flask, request, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Backend is running!"


@app.route("/save-json", methods=["POST"])
def save_json():
    data = request.get_json()

    with open("data.json", "w") as json_file:
        json_file.write(json.dumps(data, indent=2))

    return jsonify({"message": "Données sauvegardées avec succès !"})


if __name__ == "__main__":
    app.run(debug=True)
