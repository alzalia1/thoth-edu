# Import libraries
from flask import jsonify

# Import app
from appInit import Eval, db


def delete(data):

    evalASuppr = Eval.query.filter_by(id=data["id"]).first()

    db.delete(evalASuppr)
    db.commit()

    return jsonify({"status": "success"})
