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
def creaGet():
    data = request.get_json()
    return r.crea.get(data)


@app.route("/dashboard/eval/create_access", methods=["POST"])
def createAccess():
    data = request.get_json()
    return r.dashboard.eval.createAccess(data)


@app.route("/dashboard/eval/delete", methods=["POST"])
def deleteEval():
    data = request.get_json()
    return r.dashboard.eval.delete(data)


@app.route("/eval/check_access", methods=["POST"])
def checkAccess():
    data = request.get_json()
    return r.eval.checkAccess(data)


@app.route("/eval/get_eval", methods=["POST"])
def evalGetEval():
    data = request.get_json()
    return r.eval.getEval(data)


@app.route("/eval/ans_students", methods=["POST"])
def ansEleves():
    data = request.get_json()
    return r.eval.rep_eleves(data)


@app.route("/dashboard/access/get", methods=["POST"])
def getAccess():
    data = request.get_json()
    return r.dashboard.access.get(data)


@app.route("/dashboard/access/delete", methods=["POST"])
def deleteAccess():
    data = request.get_json()
    return r.dashboard.access.delete(data)


@app.route("/dashboard/access/save", methods=["POST"])
def saveAccess():
    data = request.get_json()
    return r.dashboard.access.save(data)


@app.route("/dashboard/ans/get", methods=["POST"])
def getAns():
    data = request.get_json()
    return r.dashboard.ans.get(data)


@app.route("/user/delete", methods=["POST"])
def deleteUser():
    data = request.get_json()
    return r.user.delete(data)
