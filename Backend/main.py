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
from flask_jwt_extended import jwt_required

# Import routes (and other modules)
import routes as r
from appInit import app


@app.route("/")
def home():
    return r.home()


@app.route("/user/signup", methods=["POST"])
def signup():
    data = request.get_json()
    return r.user.signup(data)


@app.route("/user/login", methods=["POST"])
def connexion():
    data = request.get_json()
    return r.user.login(data)


@app.route("/user/check", methods=["POST"])
@jwt_required()
def check():
    return jsonify({ "status" : "success" })
