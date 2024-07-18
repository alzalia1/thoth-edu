# Import libraries
import csv
import json
from flask import jsonify

# Import app
from appInit import Acces, Eval

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })


# Import libraries
import csv
import json
from flask import jsonify

# Import app
from appInit import Acces, Eval


def get(data):
    """Affiche les questions et éponses sur la page de présentation des accès"""

    acces: Acces = Acces.query.filter_by(id=data["id"]).first()
    eval: Eval = Eval.query.filter_by(id=acces.modele).first()

    # Recherche des questions pour l'affichage
    with open(eval.cheminCSV, "r", encoding="utf-8") as fichierEval:
        lecteur_csv = csv.reader(fichierEval, delimiter=",")
        next(lecteur_csv)
        next(lecteur_csv)
        listeQuestions = list(lecteur_csv)

    listeRep: list = [
        {
            "name": listeQuestions[i][0],
            "id": listeQuestions[i][1],
            "note": int(listeQuestions[i][3]) / int(listeQuestions[i][4]),
            "answered_at": listeQuestions[i][2],
        }
        for i in range(len(listeQuestions[2:]))
    ]

    listeNotes: list = [listeRep[i]["note"] for i in range(len(listeRep))]

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
