# Import libraries
from flask import jsonify


# Import app
from appInit import app, db, User


def logout():
    # answer = jsonify({"status": "succes", "reason": "none"})
    # unset_jwt_cookies(answer)
    # return answer
    return jsonify("Je te l'avais dit")
