# Import libraries
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
import csv
from random import randint
import os
import jwt
import json


# Import app
from appInit import db, Eval, secret


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
    if data["id"] != "none":

        evalMAJ = Eval.query.filter_by(id=data["id"]).first()

        if not evalMAJ:  # id erroné
            return jsonify(
                {"status": "fail", "reason": "Identifiant d'évaluation non valide"}
            )

        # On ouvre le fichier csv pour modifier les données, à l'aide de l'emplacement du fichier, dans les attributs de 'evals'
        lienCSV = evalMAJ.cheminCSV
        lienJSON = evalMAJ.cheminJSON

        listeQuestionsMAJ = [
            data["eval"]["questions"][i] for i in range(len(data["eval"]["questions"]))
        ]
        enteteMAJ = ["idEleve", "idAcces", "dateRep"]
        for i, quest in enumerate(listeQuestionsMAJ):
            enteteMAJ = enteteMAJ + [
                "id_Q" + str(i),
                "question_Q" + str(i),
                "rep_Q" + str(i),
                "note_Q" + str(i),
            ]
        contenuMAJ = [None, None, None]
        for i, quest in enumerate(data["eval"]["questions"]):
            contenuMAJ = contenuMAJ + [i, quest, None, None]

        with open(lienCSV, "w") as fichierEval:
            writer = csv.writer(fichierEval)
            writer.writerow(enteteMAJ)
            writer.writerow(contenuMAJ)

        with open(lienJSON, "w") as fichierEval:
            json.dump(data["eval"], fichierEval)

    else:
        # Pour une nouvelle évaluation, nous avons besoin d'initialiser tous les attributs
        # id ; nom ; cheminJSON ; cheminCSV ; idProf
        nouvelID = creationID()

        while nouvelID in Eval.query.filter_by(id=nouvelID):
            nouvelID = creationID()

        decoded_jwt = jwt.decode(data["token"], secret, algorithms=["HS256"])
        idProf = decoded_jwt["sub"]

        nouveauCheminJSON = (
            f"/home/debian/thoth-edu/database/evals/{idProf}/{nouvelID}.json"
        )
        nouveauCheminCSV = (
            f"/home/debian/thoth-edu/database/evals/{idProf}/{nouvelID}.csv"
        )

        if not os.path.exists(f"/home/debian/thoth-edu/database/evals/{idProf}"):
            nouveauCheminCSVINIT = os.path.join(
                f"/home/debian/thoth-edu/database/evals/", idProf
            )
            os.makedirs(nouveauCheminCSVINIT, exist_ok=True)

        evalInit = Eval(
            id=nouvelID,
            nom=data["eval"]["name"],
            cheminJSON=nouveauCheminJSON,
            cheminCSV=nouveauCheminCSV,
            idProf=idProf,
        )

        db.session.add(evalInit)
        db.session.commit()

        listeQuestionsInit = [
            data["eval"]["questions"][i] for i in range(len(data["eval"]["questions"]))
        ]
        enteteInit = ["idEleve", "idAcces", "dateRep"]
        for i, quest in enumerate(listeQuestionsInit):
            enteteInit = enteteInit + [
                "id_Q" + str(i),
                "question_Q" + str(i),
                "rep_Q" + str(i),
                "note_Q" + str(i),
            ]
        contenuInit = [None, None, None]
        for i, quest in enumerate(data["eval"]["questions"]):
            contenuInit = contenuInit + [i, quest, None, None]

        with open(nouveauCheminCSV, "w") as fichierEval:
            writer = csv.writer(fichierEval)
            writer.writerow(enteteInit)
            writer.writerow(contenuInit)

        with open(nouveauCheminJSON, "w") as fichierEval:
            json.dump(data["eval"], fichierEval)

    return jsonify({"status": "success"})
