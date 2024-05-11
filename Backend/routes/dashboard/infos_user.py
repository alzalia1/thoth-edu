# Import libraries
from flask import jsonify
import jwt

# Import app
from appInit import User, Eval, secret


def infos_user(data):

    tokenDecode = jwt.decode(data["token"], secret, algorithms=["HS256"])
    user = User.query.filter_by(id=tokenDecode["sub"]).first()

    evals = Eval.query.filter_by(idProf=user.id).all()

    aReturn = {
        "username": user.nom,
        "evals": [{"name": evals[i].nom, "id": evals[i].id} for i in range(len(evals))],
    }
    return jsonify(aReturn)
