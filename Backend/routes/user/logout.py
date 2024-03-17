# Import libraries
from flask import jsonify
from flask_jwt_extended import unset_jwt_cookies

# Import app
from appInit import app, db, User


def logout():
    response = jsonify({"status": "succes", "reason": "none"})
    unset_jwt_cookies(response)
    return response
