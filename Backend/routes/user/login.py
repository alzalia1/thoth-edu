# Import libraries
from flask import jsonify
import jwt
import time

# Import app
from appInit import User, bcrypt, secret


def login(data):
    """test"""
    user = User.query.filter_by(id=data["id"]).first()

    hashedPassword = bcrypt.generate_password_hash(data["mdp"]).decode("utf-8")

    if not user:
        return jsonify(
            {
                "status": "fail",
                "reason": "identifiant inexistant",
                "access_token": "none",
            }
        )  # Identifiant inexistant
    elif not bcrypt.check_password_hash(user.mdp, data["mdp"]):
        return jsonify(
            {
                "status": "fail",
                "reason": "Mot de passe erroné",
                "access_token": "none",
            }
        )  # MdP erroné

    access_token = jwt.encode(
        {"sub": user.id, "iat": time.time(), "exp": time.time() + 3600},
        secret,
        algorithm="HS256",
    )
    data = {"status": "success", "reason": "none", "access_token": access_token}
    return jsonify(data)
