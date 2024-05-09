# Import libraries
from flask import jsonify
import csv
import json

# Import app
from appInit import Eval


def get(data):

    eval = Eval.query.filter_by(id=data["id"]).first()

    with open(eval.cheminJSON, "r", encoding="utf-8") as fichierEval:
        contenu = fichierEval.read()
        dataAReturn = json.loads(contenu)

    aReturn = {"eval": dataAReturn}

    return jsonify(aReturn)
