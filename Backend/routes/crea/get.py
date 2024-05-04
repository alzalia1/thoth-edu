# Import libraries
from flask import jsonify
import csv

# Import app
from appInit import Eval


def get(data):

    eval = Eval.query.filter_by(id=data["id"]).first()

    if eval == None:
        return jsonify({"status": "fail", "reason": "ID faux"})

    with open(eval.cheminJSON, "w") as fichierEval:
        reader = csv.reader(fichierEval)
        reader.readrow()
        contenuEval = reader.readrow()

    aReturn = {"eval": contenuEval}
    return jsonify(aReturn)
