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
import jwt
import time

# from flask_jwt_extended import jwt_required

# Import routes (and other modules)
import routes as r
from appInit import app, secret


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
def check():
    data = request.get_json()
    return r.user.check(data)


@app.route("/dashboard/infos_user", methods=["POST"])
def infos_user():
    data = request.get_json()
    return r.dashboard.infos_user(data)


@app.route("/crea/save", methods=["POST"])
def save():
    data = request.get_json()
    return r.crea.save(data)


@app.route("/dashboard/eval/get", methods=["POST"])
def getDashboard():
    data = request.get_json()
    return r.dashboard.eval.get(data)


@app.route("/crea/get", methods=["POST"])
def getEval():
    data = request.get_json()
    return r.crea.get(data)
