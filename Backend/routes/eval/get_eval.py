# Import libraries
from flask import jsonify
import json
import csv

# Import app
from appInit import Acces, Eval
from fonctions.trouverID import trouverID


def getEval(data):

    acces = Acces.query.filter_by(id=data["id"]).first()
    evalAssociee = Eval.query.filter_by(id=acces.modele).first()

    with open(evalAssociee.cheminJSON, "r", encoding="utf-8") as fichierEval:
        contenu = fichierEval.read()
        dataAReturn = json.loads(contenu)

    # Ouverture du fichier CSV en mode lecture pour trouver les id des questions
    with open(evalAssociee.cheminCSV, "r", encoding="utf-8") as fichierEval:
        lecteur_csv = csv.reader(fichierEval, delimiter=",")
        next(lecteur_csv)
        ligneQuestions = next(lecteur_csv)

    # Utilisation de la ligne sortie du csv
    listeQuestions = ligneQuestions.split(",")
    listeQuestions = listeQuestions[3:]

    # Conversion éval prof en eval élève
    for i, quest in enumerate(dataAReturn["questions"]):
        quest["id"] = trouverID(quest, listeQuestions)
        if quest["type"] == "traduction":
            quest["reponse"] = {}
        else:
            del quest["reponse"]["verbes"]
        quest["points"] = quest["params"]["points"]
        del quest["params"]

    aReturn = {
        "name": acces.nom,
        "eval": dataAReturn,
        "time": {
            "start": acces.dateDeb,
            "end": acces.dateFin,
        },
    }

    return jsonify(aReturn)
