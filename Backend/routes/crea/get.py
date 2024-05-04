# Import libraries
from flask import jsonify
import csv
import json

# Import app
from appInit import Eval


def get(data):

    eval = Eval.query.filter_by(id=data["id"]).first()

    if eval == None:
        return jsonify({"status": "fail", "reason": "ID faux"})

    with open(eval.cheminJSON, "r") as fichierEval:
        dataAReturn = json.load(fichierEval)

    aReturn = {"eval": dataAReturn}
    return jsonify(aReturn)
