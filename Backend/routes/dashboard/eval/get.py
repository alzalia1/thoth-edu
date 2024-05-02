# Import libraries
from flask import jsonify
import time

# Import app
from appInit import app, db, Acces, Eval


def etatAcces(acces):
    if time.time() < acces.dateDeb:
        return 0
    elif time.time() > acces.dateFin:
        return 2
    return 1



def get(data):
    
    eval = Eval.query.filter_by(id=data["id"]).first()

    if eval == None:
        return jsonify({ "status" : "fail", "reason" : "Id erroné" })

    listeAcces = Acces.query.filter_by(modele=data["id"]).all()
    dicoAcces = [ { "id" : acces.id, "nom" : acces.nom, "status" : etatAcces(acces), "note" : None } for acces in listeAcces ]

    data = { "name" : eval.nom, "note" : None, "nb_reps" : None, "acces" : dicoAcces }
    return jsonify(data)
