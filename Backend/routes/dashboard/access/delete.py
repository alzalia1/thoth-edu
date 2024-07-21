# Import libraries
from flask import jsonify
import csv

# Import app
from appInit import Acces, Eval, db

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })


def delete(data: dict):
    """Suppression d'un accès, y compris les réponses concernées dans le fichier CSV
    Agit aussi sur la BDD"""

    # Recherche de l'accès, de l'évaluation associée
    acces: Acces = Acces.query.filter_by(id=data["id"]).first()
    eval: Eval = Eval.query.filter_by(id=acces.modele).first()

    # Recherche de toutes les réponses de l'accès dans le fichier CSV (2e colonne)
    with open(eval.cheminCSV, "r", encoding="utf-8") as fichierEval:
        lecteur_csv = csv.reader(fichierEval, delimiter=",")
        listeReps: list = list(lecteur_csv)

    # Recherche des lignes à supprimer
    for ind, rep in enumerate(listeReps[2:]):
        if rep[1] == data["id"]:
            del listeReps[ind]

    # Redéfinition des ids
    for i in range(2, len(listeReps)):
        listeReps[i][0] == i

    # Réécriture des lignes restantes
    with open(eval.cheminCSV, "w", encoding="utf-8") as fichierEval:
        writer = csv.writer(fichierEval)
        writer.writerows(listeReps)

    db.session.delete(acces)
    db.session.commit()

    return jsonify({"status": "success"})
