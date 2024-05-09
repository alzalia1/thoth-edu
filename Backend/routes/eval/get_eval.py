# Import libraries
from flask import jsonify
import json

# Import app
from appInit import Acces, Eval

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })

# {
#  "name" : "nom de l'évaluation",
#  "questions" : [ {
#   "id" : "id de la question",
#   "type" : "type de question",
#   "consigne" : "consigne"
#   "points" : "points de la question"
#   "reponse" : { } // Ce champ est spécifique aux questions conjugaison. Il doit contenir les champs "pronoms" et "temps" tels qu'ils sont enregistrés normalement"
# } ]
# }


def getEval(data):

    acces = Acces.query.filter_by(id=data["id"]).first()
    evalAssociee = Eval.query.filter_by(id=acces.modele).first()

    with open(evalAssociee.cheminJSON, "r") as fichierEval:
        contenu = fichierEval.read()
        dataAReturn = json.loads(contenu)

    # Conversion éval prof en eval élève
    for quest in dataAReturn["questions"]:
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
