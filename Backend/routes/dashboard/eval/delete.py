# Import libraries
from flask import jsonify

# Import app
from appInit import Eval, db


def delete(data):

    evalASuppr = Eval.query.filter_by(id=data["id"]).first()

    db.session.delete(evalASuppr)
    db.session.commit()

    return jsonify({"status": "success"})
