# Import libraries
from flask import jsonify
from flask_jwt_extended import create_access_token

# Import app
from appInit import User, bcrypt


def login(data):
    """test"""
    user = User.query.filter_by(id=data["id"]).first()

    hashedPassword = bcrypt.generate_password_hash(data["mdp"]).decode("utf-8")

    print(bcrypt.check_password_hash(user.mdp, data["mdp"]))

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

    access_token = create_access_token(identity=user)
    data = {"status": "success", "reason": "none", "access_token": access_token}
    return jsonify(data)
