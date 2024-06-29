# Import libraries
from flask import jsonify
import jwt
import time

# Import app
from appInit import User, bcrypt, secret


def login(data):
    """test"""
    user = User.query.filter_by(nom=data["id"]).first()

    hashedPassword = bcrypt.generate_password_hash(data["psswd"]).decode("utf-8")

    if not user:
        return jsonify(
            {
                "status": "fail",
                "reason": "identifiant inexistant",
                "token": "none",
            }
        )  # Identifiant inexistant
    elif not bcrypt.check_password_hash(user.mdp, data["psswd"]):
        return jsonify(
            {
                "status": "fail",
                "reason": "Mot de passe erroné",
                "token": "none",
            }
        )  # MdP erroné

    token = jwt.encode(
        {"sub": user.id, "iat": time.time(), "exp": time.time() + 3600},
        secret,
        algorithm="HS256",
    )
    data = {"status": "success", "reason": "none", "token": token}
    return jsonify(data)
