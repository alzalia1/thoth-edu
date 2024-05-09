# Import libraries
from flask import jsonify
import os

# Import app
from appInit import Eval, db, Acces


def delete(data):

    evalASuppr = Eval.query.filter_by(id=data["id"]).first()

    try:
        os.remove(evalASuppr.cheminJSON)
    except FileNotFoundError:
        pass

    try:
        os.remove(evalASuppr.cheminCSV)
    except FileNotFoundError:
        pass

    listeAcces = Acces.query.filter_by(modele=evalASuppr.id).all()

    for acces in listeAcces:
        db.session.delete(acces)
    db.session.delete(evalASuppr)
    db.session.commit()

    return jsonify({"status": "success"})
