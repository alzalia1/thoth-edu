# main.py

# Pour créer une nouvelle route (accessible via https://api.thoth-edu.fr/{nom de la route}), utiliser la structure suivante :

# @app.route("/{nom de la route}")
# def {nom de la fonction associée}({arguments ?}):

#     $$ contenu de la fonction

#     $$ création d'un message à retourner

#     return message

# Il est préférable que la fonction réelle s'éxécute dans un fichier de route (voir le dossier routes)

from flask import Flask, request, jsonify
import json
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins="https://thoth-edu.fr")

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
