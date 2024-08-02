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

    print(data)

    acces.nom = data["name"]
    acces.modele = data["id_eval"]
    acces.random = data["random"]
    acces.dateDeb = data["time"]["start"]
    acces.dateFin = data["time"]["end"]

    db.session.commit()

    return jsonify({"status": "success", "reason": "none"})
