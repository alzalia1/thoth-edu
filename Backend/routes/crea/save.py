# Import libraries
from flask import jsonify
import csv
import os
import jwt
import json
from fonctions.creationID import creationID


# Import app
from appInit import db, Eval, secret


def save(data):
    """Sauvegarde ou met à jour le contenu d'une évaluation"""
    # Si ce n'est pas la première sauvegarde on modifie juste le fichier existant
    if data["id"] != "none":

        evalMAJ = Eval.query.filter_by(id=data["id"]).first()

        if not evalMAJ:  # id erroné
            return jsonify(
                {"status": "fail", "reason": "Identifiant d'évaluation non valide"}
            )

        evalMAJ.nom = data["eval"]["name"]

        db.session.commit()

        # On ouvre le fichier csv pour modifier les données, à l'aide de l'emplacement du fichier, dans les attributs de 'evals'
        lienCSV = evalMAJ.cheminCSV
        lienJSON = evalMAJ.cheminJSON

        listeQuestionsMAJ = [
            data["eval"]["questions"][i] for i in range(len(data["eval"]["questions"]))
        ]
        enteteMAJ = ["idEleve", "idAcces", "dateRep", "noteTot", "totPoints"]
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

        with open(lienCSV, "w", encoding="utf-8") as fichierEval:
            writer = csv.writer(fichierEval)
            writer.writerow(enteteMAJ)
            writer.writerow(contenuMAJ)

        with open(lienJSON, "w") as fichierEval:
            json.dump(data["eval"], fichierEval)

    else:
        # Pour une nouvelle évaluation, nous avons besoin d'initialiser tous les attributs
        # id ; nom ; cheminJSON ; cheminCSV ; idProf
        nouvelID = creationID(6)

        while nouvelID in Eval.query.filter_by(id=nouvelID):
            nouvelID = creationID(6)

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

        with open(nouveauCheminCSV, "w", encoding="utf-8") as fichierEval:
            writer = csv.writer(fichierEval)
            writer.writerow(enteteInit)
            writer.writerow(contenuInit)

        with open(nouveauCheminJSON, "w") as fichierEval:
            json.dump(data["eval"], fichierEval)

        evalInit = Eval(
            id=nouvelID,
            nom=data["eval"]["name"],
            cheminJSON=nouveauCheminJSON,
            cheminCSV=nouveauCheminCSV,
            idProf=idProf,
        )

        db.session.add(evalInit)
        db.session.commit()

    return jsonify({"status": "success"})
