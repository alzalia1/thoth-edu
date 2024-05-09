# Import libraries
from flask import jsonify
import csv
import time

# Import app
from appInit import Acces


def rep_eleves(data):

    acces = Acces.query.filter_by(id=data["id_acces"])

    # Création de la ligne à ajouter en CSV
    ligneEleve = [data["id_el"], data["id_acces"], time.time()]

    for i, quest in enumerate(data["reponses"]):
        for questions in data["questions"]:
            if questions["id"] == i:
                repOrdre = questions
                del questions
                break
        ligneEleve = ligneEleve + [i, None, repOrdre["questions"], None]

    with open(acces.cheminCSV, "a", newline="", encoding=("utf-8")) as fichierEval:
        ecrivain_csv = csv.writer(fichierEval)
        ecrivain_csv.writerow(ligneEleve)

    return jsonify({"status": "success"})
