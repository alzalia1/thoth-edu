# Import libraries
from flask import jsonify
import os

# Import app
from appInit import Eval, db


def delete(data):

    evalASuppr = Eval.query.filter_by(id=data["id"]).first()

    os.remove(evalASuppr.cheminJSON)
    os.remove(evalASuppr.cheminCSV)

    db.session.delete(evalASuppr)
    db.session.commit()

    return jsonify({"status": "success"})
