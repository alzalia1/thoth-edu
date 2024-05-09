# Import libraries
from flask import jsonify
import json
import csv

# Import app
from appInit import Acces, Eval


def trouverID(question, listeQ):
    """Forme globale de la listeQ : [id1, question1, inutile1, inutile1, id2, question2, etc]"""
    for indice in range(len(listeQ) // 4):
        if listeQ[indice + 1] == question:
            return listeQ[indice]


def getEval(data):

    acces = Acces.query.filter_by(id=data["id"]).first()
    evalAssociee = Eval.query.filter_by(id=acces.modele).first()

    with open(evalAssociee.cheminJSON, "r") as fichierEval:
        contenu = fichierEval.read()
        dataAReturn = json.loads(contenu)

    # Ouverture du fichier CSV en mode lecture pour trouver les id des questions
    with open("nom_du_fichier.csv", "r") as fichier_csv:

        # Création d'un objet lecteur CSV
        lecteur_csv = csv.reader(fichier_csv, delimiter=",")
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
