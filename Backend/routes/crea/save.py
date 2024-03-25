# Import libraries
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

# Import app
from appInit import app, db, User, bcrypt, Eval


def save(data):

    eval = Eval(cheminJSON=data[eval], idProf=get_jwt_identity(data["token"]))

    db.session.add(eval)
    db.session.commit()

    return jsonify({"status": "success"})
