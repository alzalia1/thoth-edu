# Import libraries
from flask import jsonify
import csv
import time

# Import app
from appInit import Acces, Eval

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })

# * {
# *  "id_el" : "ID de l'accès actuel de l'élève",
# *  "id_access" : "ID de l'accès auquel l'élève répond",
# *  "reponses" : [
# *   { "struct. gen. rep. el." },
# *   { "struct. gen. rep. el." }
# *  ]
# * }


def rep_eleves(data):

    acces = Acces.query.filter_by(id=data["id_acces"])

    # Création de la ligne à ajouter en CSV
    ligneEleve = [data["id_el"], data["id_acces"], time.time()]

    for i in range(len(data["reponses"])):
        acces = None

    return jsonify({"": ""})
