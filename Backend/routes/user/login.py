# Import libraries
from flask import jsonify
from flask_jwt_extended import create_access_token

# Import app
from appInit import User, bcrypt


def login(data):
    """test"""
    user = User.query.filter_by(id=data["id"]).first()

    if not user or bcrypt.check_password_hash(bcrypt.generate_password_hash(data["mdp"]).decode("utf-8"), user.mdp):
        return (
            jsonify(
                {
                    "status": "fail",
                    "reason": "Mot de passe erroné ou identifiant inexistant",
                    "access_token": "none"
                }
            )
        )  # MdP erroné ou identifiant inexistant

    access_token = create_access_token(identity=user.id)
    data = {"status": "success", "reason": "none", "access_token": access_token}
    return jsonify(data)
