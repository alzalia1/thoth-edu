# main.py

# Pour créer une nouvelle route (accessible via https://api.thoth-edu.fr/{{route}}), utiliser la structure suivante :

# @app.route("/{{route}}")
# def {nom de la fonction associée}():
#     data = request.get_json()
#     return r.{{nom de la fonction route}}(data)

# Il est préférable que la fonction réelle s'éxécute dans un fichier de route

# Import libraries
from flask import request, jsonify
import json

# Import routes (and other modules)
import routes as r
from appInit import (app,data_path)


@app.route("/")
def home():
    return r.home()

# Cette fonction sert simplement d'exemple, elle peut être supprimée quand plus nécessaire !
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


@app.route("/user/signup", methods=["POST"])
def signup():
    data = request.get_json()
    return r.signup(data)
    


@app.route("/user/login", methods=["GET"])
def connexion():
    data = request.get_json()
    return r.login(data)
