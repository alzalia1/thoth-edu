# Import libraries
from flask import jsonify

# Import app
from appInit import Acces, Eval

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })


def get(data):
    """Retrouve l'évaluation d'un élève"""

    acces: Acces = Acces.query.filter_by(id=data["id_access"]).first
    eval: Eval = Eval.query.filter_by(modele=data["id_access"]).first

    aReturn: dict = {"ans": "", "name": ""}
    return jsonify(aReturn)
