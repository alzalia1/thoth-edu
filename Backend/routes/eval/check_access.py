# Import libraries
from flask import jsonify
from fonctions.etatAcces import etatAcces

# Import app
from appInit import Acces


def checkAccess(data):
    eval = Acces.query.filter_by(id=data["id"]).first()
    if eval == None or etatAcces(eval) != 1:
        return jsonify({"exist": "no"})
    return jsonify({"exist": "yes"})
