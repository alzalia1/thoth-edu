# main.py
from libs.flask import Flask, request, jsonify
import json
from libs.flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins="https://thtoh-edu.fr")

# Get the directory of the current script
script_dir = os.path.dirname(os.path.realpath(__file__))

# Construct the path to data.json
data_path = os.path.join(script_dir, "data.json")


@app.route("/")
def home():
    return "Hello :)"


@app.route("/save-json", methods=["POST"])
def save_json():
    data = request.get_json()

    try:
        with open(data_path, "w") as json_file:
            json_file.write(json.dumps(data, indent=2))
        message = "Données sauvegardées avec succès !"
    except Exception as e:
        message = (
            f"Une erreur s'est produite lors de la sauvegarde des données : {str(e)}"
        )

    response = jsonify({"message": message})

    return response
