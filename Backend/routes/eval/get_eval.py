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
    for quest in dataAReturn["questions"]:
        if quest["type"] == "traduction":
            quest["answer"] = {}
        else:
            del quest["answer"]["verbs"]
        quest["points"] = quest["params"]["points"]
        del quest["params"]

    if acces.random == 1:
        listeQuest = [question for question in dataAReturn["questions"]]
        random.shuffle(listeQuest)
        dataAReturn["questions"] = listeQuest

    aReturn = {
        "name": acces.nom,
        "eval": dataAReturn,
        "time": {
            "start": acces.dateDeb,
            "end": acces.dateFin,
        },
    }

    return jsonify(aReturn)
