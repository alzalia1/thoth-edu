# Import libraries
from flask import jsonify

# Import app
from appInit import Acces, db

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })


def save(data):
    "Reçoit la structure générale d'un accès et modifie la BDD en conséquence"

    # Recherche de l'accès correspondant
    acces: Acces = Acces.query.filter_by(id=data["id_access"]).first()

    if data["name"] != acces.nom:
        acces.nom = data["name"]

    if data["id_eval"] != acces.modele:
        acces.modele = data["id_eval"]

    if data["random"] != acces.random:
        acces.random = data["random"]

    if data["time"]["start"] != acces.dateDeb:
        acces.dateDeb = data["time"]["start"]

    if data["time"]["end"] != acces.dateFin:
        acces.dateFin = data["time"]["end"]

    db.session.commit()

    return jsonify({"": ""})
