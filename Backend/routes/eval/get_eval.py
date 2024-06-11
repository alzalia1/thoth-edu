# Import libraries
from flask import jsonify
import json
import csv
import random

# Import app
from appInit import Acces, Eval


def getEval(data):

    acces = Acces.query.filter_by(id=data["id"]).first()
    evalAssociee = Eval.query.filter_by(id=acces.modele).first()

    with open(evalAssociee.cheminJSON, "r", encoding="utf-8") as fichierEval:
        contenu = fichierEval.read()
        dataAReturn = json.loads(contenu)

    # Conversion éval prof en eval élève
    for i, quest in enumerate(dataAReturn["questions"]):
        if quest["type"] == "traduction":
            quest["reponse"] = {}
        else:
            del quest["reponse"]["verbes"]
        quest["points"] = quest["params"]["points"]
        del quest["params"]

    if acces.random == 1:
        listeData = list(dataAReturn.items())
        random.shuffle(listeData)
        dataAReturn = dict(listeData)

    aReturn = {
        "name": acces.nom,
        "eval": dataAReturn,
        "time": {
            "start": acces.dateDeb,
            "end": acces.dateFin,
        },
    }

    return jsonify(aReturn)
