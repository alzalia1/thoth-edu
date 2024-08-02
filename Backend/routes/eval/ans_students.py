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

    # Définition de l'id
    with open(evalAssociee.cheminCSV, "r", encoding=("utf-8")) as fichierEval:
        idEleve = sum(1 for _ in fichierEval) + 1

    # Création de la ligne à ajouter en CSV
    ligneEleve = [idEleve, data["id_el"], data["id_access"], time.time()]

    listeOrdre = sorted(data["answers"], key=lambda x: x["id"])

    for i, quest in enumerate(listeOrdre):
        ligneEleve = ligneEleve + [i, None, quest["answer"], None, None]

    # Recherche des questions en JSON puis le tri grâce aux ids
    with open(evalAssociee.cheminJSON, "r", encoding="utf-8") as fichierEval:
        contenu = fichierEval.read()
        dicoJSON = json.loads(contenu)

    listeQuestions = sorted(dicoJSON["questions"], key=lambda x: x["id"])

    ligneElevePoints = (
        ligneEleve[:4] + [-1, -1] + correctionEl(listeQuestions, ligneEleve[4:])
    )

    with open(
        evalAssociee.cheminCSV, "a", newline="", encoding=("utf-8")
    ) as fichierEval:
        ecrivain_csv = csv.writer(fichierEval)
        ecrivain_csv.writerow(ligneElevePoints)

    return jsonify({"status": "success"})
