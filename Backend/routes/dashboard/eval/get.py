# Import libraries
from flask import jsonify
import time
from fonctions.etatAcces import etatAcces

# Import app
from appInit import app, db, Acces, Eval


def get(data):

    eval = Eval.query.filter_by(id=data["id"]).first()

    if eval == None:
        return jsonify({"status": "fail", "reason": "Id erroné"})

    listeAcces = Acces.query.filter_by(modele=data["id"]).all()
    dicoAcces = [
        {"id": acces.id, "name": acces.nom, "status": etatAcces(acces), "note": 0}
        for acces in listeAcces
    ]

    data = {"name": eval.nom, "mark": 0, "nb_ans": 0, "access": dicoAcces}
    return jsonify(data)
