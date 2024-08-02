# Import libraries
import csv
import json
from flask import jsonify

# Import app
from appInit import Acces, Eval

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })


def get(data):
    """Affiche les questions et éponses sur la page de présentation des accès"""

    acces: Acces = Acces.query.filter_by(id=data["id"]).first()
    eval: Eval = Eval.query.filter_by(id=acces.modele).first()

    # Recherche des questions pour l'affichage
    with open(eval.cheminCSV, "r", encoding="utf-8") as fichierEval:
        lecteur_csv = csv.reader(fichierEval, delimiter=",")
        next(lecteur_csv)
        next(lecteur_csv)
        listeQuestion = list(lecteur_csv)

    lQAcces: list = [quest for quest in listeQuestion if quest[2] == data["id"]]

    listeRep: list = [
        {
            "id": lQAcces[i][0],
            "name": lQAcces[i][1],
            "mark": int(lQAcces[i][4]) / int(lQAcces[i][5]),
            "answered_at": lQAcces[i][3],
        }
        for i in range(len(lQAcces))
    ]

    listeNotes: list = [listeRep[i]["mark"] for i in range(len(listeRep))]

    if not listeNotes:
        note = "Non noté"
    else:
        note = sum(listeNotes) / len(listeNotes)

    # Mise en forme pour le return
    structGenAcces = {
        "name": acces.nom,
        "id_eval": acces.modele,
        "random": acces.random,
        "time": {"start": acces.dateDeb, "end": acces.dateFin},
    }

    data = {
        "access": structGenAcces,
        "mark": note,
        "ans": listeRep,
    }

    return jsonify(data)
