# Import libraries
from flask import jsonify
import csv
import time
import json

# Import app
from appInit import Acces, Eval
from fonctions.correctionEl import correctionEl


def rep_eleves(data):

    acces = Acces.query.filter_by(id=data["id_access"]).first()
    evalAssociee = Eval.query.filter_by(id=acces.modele).first()

    # Création de la ligne à ajouter en CSV
    ligneEleve = [data["id_el"], data["id_access"], time.time()]

    print(data["responses"])

    listeOrdre = sorted(data["responses"], key=lambda x: x["id"])

    for i, quest in enumerate(listeOrdre):
        ligneEleve = ligneEleve + [i, None, quest["reponse"], None]

    # Recherche de la ligne en csv
    with open(evalAssociee.cheminCSV, "r", encoding="utf-8") as fichierEval:
        lecteur_csv = csv.reader(fichierEval, delimiter=",")
        next(lecteur_csv)
        listeQuestions = next(lecteur_csv)

    # Recherche des questions en JSON pour pouvoir faire la liste à l'aide des id du csv
    with open(evalAssociee.cheminJSON, "r", encoding="utf-8") as fichierEval:
        contenu = fichierEval.read()
        dicoJSON = json.loads(contenu)

    # Insertion de la bonne question associé à l'id (car actuellement en str et non un dico)
    for question in dicoJSON["questions"]:
        for ind in range(3, len(listeQuestions), 4):
            if listeQuestions[ind + 1] == str(question):
                print(question)
                listeQuestions[ind + 1] = question
    print(listeQuestions)

    ligneElevePoints = ligneEleve[:3] + correctionEl(listeQuestions[3:], ligneEleve[3:])

    with open(
        evalAssociee.cheminCSV, "a", newline="", encoding=("utf-8")
    ) as fichierEval:
        ecrivain_csv = csv.writer(fichierEval)
        ecrivain_csv.writerow(ligneElevePoints)

    return jsonify({"status": "success"})
