# Import libraries
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
import csv
from random import randint
import os

# Import app
from appInit import app, db, User, bcrypt, Eval


listeID = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
]


def creationID():
    id = ""
    while len(id) < 6:
        id = id + listeID[randint(0, len(listeID) - 1)]
    return id


def save(data):
    """Sauvegarde ou met à jour le contenu d'une évaluation"""
    # Si ce n'est pas la première sauvegarde on modifie juste le fichier existant
    if data["id"]:

        evals = Eval.query.filter_by(id=data["id"]).first()

        if not evals:  # id erroné
            return jsonify(
                {"status": "fail", "reason": "Identifiant d'évaluation non valide"}
            )

        # On ouvre le fichier csv pour modifier les données, à l'aide de l'emplacement du fichier, dans les attributs de 'evals'
        lienJSON = evals.cheminJSON

        listeQuestions = [
            data["eval"]["questions"][i] for i in range(len(data["eval"]["questions"]))
        ]
        entete = [
            "idEleve",
            "idAcces",
            "dateRep",
        ]  # + ["id_Q"+str(i), "question_Q"+str(i), "rep_Q"+str(i), "note_Q"+str(i) for i in range(1, len(listeQuestions)+1)]
        contenu = []

        with open(lienJSON, "w") as fichierEval:
            writer = csv.writer(fichierEval)
            writer.writerow(entete)
            writer.writerows()

    # Pour une nouvelle évaluation, nous avons besoin d'initialiser tous les attributs
    # id ; nom ; cheminJSON ; cheminCSV ; idProf
    nouvelID = creationID()

    while nouvelID in Eval.query.filter_by(id=nouvelID):
        nouvelID = creationID()

    idProf = get_jwt_identity(data["token"]).id

    nouveauCheminJSON = (
        f"/home/debian/thoth-edu/database/evals/${idProf}/${nouvelID}.json"
    )
    nouveauCheminCSV = (
        f"/home/debian/thoth-edu/database/evals/${idProf}/${nouvelID}.csv"
    )

    if not os.path.exists(nouveauCheminJSON):
        nouveauCheminJSONINIT = os.path.join(nouveauCheminJSON, idProf)
        os.makedirs(nouveauCheminJSONINIT, exist_ok=True)

    eval = Eval(
        id=nouvelID,
        nom=data["eval"]["name"],
        cheminJSON=nouveauCheminJSON,
        cheminCSV=nouveauCheminCSV,
        idProf=idProf,
    )

    db.session.add(eval)
    db.session.commit()

    with open(nouveauCheminJSON, "w") as fichierEval:
        writer = csv.writer(fichierEval)
        writer.writerow(["id", "question"])
        for i, question in enumerate(len(data["eval"]["questions"])):
            writer.writerow([i + 1, str(question)])

    return jsonify({"status": "success"})
