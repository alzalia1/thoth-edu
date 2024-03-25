# Import libraries
from flask import jsonify

# Import app
from appInit import app, db, Acces, bcrypt, Eval


def getEval(data):

    evalCherchee = None
    evalCherchee = Acces.query.filter_by(id=data["id"]).first()

    assert evalCherchee != None, "Problème dans la requête"

    return jsonify(
        {
            "name": evalCherchee["id"],
            "id": data["id"],
            "eval": Eval.query.filter_by(id=evalCherchee["modele"]).first().cheminJSON,
            "time": {"start": evalCherchee["dateDeb"], "end": evalCherchee["dateFin"]},
        }
    )
