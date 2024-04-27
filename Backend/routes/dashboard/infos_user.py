# Import libraries
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

# Import app
from appInit import User, Eval


def infos_user(data):

    idProf = get_jwt_identity(data["token"])
    user = User.query.filter_by(id=idProf).first()

    evals = Eval.query.filter_by(idProf=user).all()

    aReturn = {
        "username": user.id,
        "evals": [{"name": evals[i].nom, "id": evals[i].id} for i in range(len(evals))],
    }
    return jsonify(aReturn)
