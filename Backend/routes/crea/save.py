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

    # Vérfication de l'existence du nom de l'évaluation
    if data["eval"]["name"] == "":
        return jsonify(
            {
                "status": "fail",
                "reason": "Attention : vous devez préciser un nom d'évaluation pour pouvoir l'enregistrer",
            }
        )

    evalJSON: dict = data["eval"]
    eval = None

    # Si ce n'est pas la première sauvegarde on modifie juste le fichier existant
    if data["id"] != "none":

        evaluation: Eval = Eval.query.filter_by(id=data["id"]).first()

        if not evaluation:  # id erroné
            return jsonify(
                {"status": "fail", "reason": "Identifiant d'évaluation non valide"}
            )

        evaluation.nom = data["eval"]["name"]
        lienCSV: str = evaluation.cheminCSV
        lienJSON: str = evaluation.cheminJSON

    else:
        # Pour une nouvelle évaluation, nous avons besoin d'ialiser tous les attributs
        # id ; nom ; cheminJSON ; cheminCSV ; idProf
        nouvelID = creationID(6)

        while nouvelID in Eval.query.filter_by(id=nouvelID):
            nouvelID = creationID(6)

        decoded_jwt = jwt.decode(data["token"], secret, algorithms=["HS256"])
        idProf = decoded_jwt["sub"]

        lienJSON = f"/home/debian/thoth-edu/database/evals/{idProf}/{nouvelID}.json"
        lienCSV = f"/home/debian/thoth-edu/database/evals/{idProf}/{nouvelID}.csv"

        if not os.path.exists(f"/home/debian/thoth-edu/database/evals/{idProf}"):
            creaLienCSV = os.path.join(
                f"/home/debian/thoth-edu/database/evals/", idProf
            )
            os.makedirs(creaLienCSV, exist_ok=True)

        eval = Eval(
            id=nouvelID,
            nom=data["eval"]["name"],
            cheminJSON=lienJSON,
            cheminCSV=lienCSV,
            idProf=idProf,
        )

    # On ouvre le fichier csv pour modifier les données, à l'aide de l'emplacement du fichier, dans les attributs de 'evals'

    listeQuestions = [
        data["eval"]["questions"][i] for i in range(len(data["eval"]["questions"]))
    ]
    entete = ["idEleve", "nomEleve", "idAcces", "dateRep", "noteTot", "totPoints"]
    for i, quest in enumerate(listeQuestions):
        entete = entete + [
            "id_Q" + str(i),
            "question_Q" + str(i),
            "rep_Q" + str(i),
            "note_Q" + str(i),
            "note_max_Q" + str(i),
        ]
    contenu = [None, None, None, None, None, None]
    for i, quest in enumerate(evalJSON["questions"]):
        contenu = contenu + [i, quest, None, None, quest["params"]["points"]]
        quest["id"] = i

    with open(lienCSV, "w", encoding="utf-8") as fichierEval:
        writer = csv.writer(fichierEval)
        writer.writerow(entete)
        writer.writerow(contenu)

    with open(lienJSON, "w") as fichierEval:
        json.dump(evalJSON, fichierEval)

    if eval:
        db.session.add(eval)

    db.session.commit()

    return jsonify({"status": "success"})
