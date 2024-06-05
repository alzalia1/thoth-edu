# Import libraries
from flask import jsonify


# Import app
from appInit import app, db, User


def logout():
    # response = jsonify({"status": "succes", "reason": "none"})
    # unset_jwt_cookies(response)
    # return response
    return jsonify("Je te l'avais dit")
