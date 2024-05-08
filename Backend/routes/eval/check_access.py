# Import libraries
from flask import jsonify

# Import app
from appInit import Acces


def checkAccess(data):
    eval = Acces.query.filter_by(id=data[id]).first()
    if eval == None:
        return jsonify({"exist": "no"})
    return jsonify({"exist": "yes"})
