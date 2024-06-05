# Import libraries
from flask import jsonify
import csv

# Import app
from appInit import Acces

# {
#  "access": { "struct. gen. acces" },
#  "note" : "moyenne des notes de l'accès",
#  "reps" : [ {
#   "name" : "nom du répondant",
#   "id" : "id de la copie",
#   "id_acces" : "id de l'accès associé",
#   "note" : "note /20 de l'élève",
#   "answered_at" : "timestamp du moment de rendu",
#  } ]
# }


def get(data):

    acces = Acces.query.filter_by(id=data["id"]).first()

    structGenAcces = { "name" : acces.nom, "id_eval" : acces.id, "id_access" : data["id"], "random" : acces.random, "time" : {"start" : acces.dateDeb, "end" : acces.dateFin} }

    dicoAReturn = { "access": structGenAcces, "note" : "moyenne des notes de l'accès", "reps" : [ { "name" : "nom du répondant", "id" : "id de la copie", "id_acces" : "id de l'accès associé", "note" : "note /20 de l'élève", "answered_at" : "timestamp du moment de rendu", } ]}

    return jsonify(dicoAReturn)
