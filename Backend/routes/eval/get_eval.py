# Import libraries
from flask import jsonify
import json

# Import app
from appInit import Acces, Eval

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })


def getEval(data):

    acces = Acces.query.filter_by(id=data["id"]).first()
    evalAssociee = Eval.query.filter_by(id=acces.modele).first()

    with open(evalAssociee.cheminJSON, "r") as fichierEval:
        contenu = fichierEval.read()
        dataAReturn = json.loads(contenu)

    aReturn = {
        "name": acces.nom,
        "eval": dataAReturn,
        "time": {
            "start": acces.dateDeb,
            "end": acces.dateFin,
        },
    }

    return jsonify(aReturn)
