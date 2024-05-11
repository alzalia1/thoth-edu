# Import libraries
from flask import jsonify
import csv
import time

# Import app
from appInit import Acces, Eval


def rep_eleves(data):

    acces = Acces.query.filter_by(id=data["id_access"]).first()
    print(acces)
    eval = Eval.query.filter_by(id=acces.modele).first()

    # Création de la ligne à ajouter en CSV
    ligneEleve = [data["id_el"], data["id_access"], time.time()]

    listeOrdre = sorted(data["responses"], key=lambda x: x["id"])

    for i, quest in enumerate(listeOrdre):
        ligneEleve = ligneEleve + [i, None, quest["reponse"], None]

    with open(eval.cheminCSV, "a", newline="", encoding=("utf-8")) as fichierEval:
        ecrivain_csv = csv.writer(fichierEval)
        ecrivain_csv.writerow(ligneEleve)

    return jsonify({"status": "success"})
