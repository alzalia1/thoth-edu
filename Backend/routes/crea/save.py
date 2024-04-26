# Import libraries
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

# Import app
from appInit import app, db, User, bcrypt, Eval


def save(data):
    """Sauvegarde ou met à jour le contenu d'une évaluation"""
    if data["id"]:

        evals = Eval.query.filter_by(id=data["id"]).first()

        if not evals:
            return jsonify(
                {"status": "fail", "reason": "Identifiant d'évaluation non valide"}
            )

    eval = Eval(idProf=get_jwt_identity(data["token"]))

    db.session.add(eval)
    db.session.commit()

    evals = Eval.query.filter_by(cheminJSON=data["eval"]).all()

    if evals:
        return jsonify({"status": "success"})

    return jsonify({"status": "failed"})
