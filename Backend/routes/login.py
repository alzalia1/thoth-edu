# Import libraries

from flask import jsonify
from flask_jwt_extended import create_access_token

# Import app
from appInit import (User,bcrypt)

def login(data):
    user = User.query.filter_by(username=data["id"]).first()

    if not user or user.mdp != bcrypt.generate_password_hash(data["mdp"]).decode(
        "utf-8"
    ):
        return (
            jsonify({"message": "False"}),
            401,
        )  # MdP erroné ou identifiant inexistant

    access_token = create_access_token(identity=user)
    return jsonify(access_token=access_token)