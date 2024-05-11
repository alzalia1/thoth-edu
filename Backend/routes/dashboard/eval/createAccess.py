# Import libraries
from flask import jsonify
from fonctions.creationID import creationID

# Import app
from appInit import Acces, db


""""
Structure générale d'un accès = contenu de data
{
  "name" : "nom de l'accès",
  "id_eval" : "id de l'éval associée à cet accès",
  "id_access" : "id de l'accès lui-même" // S'il s'agit de l'enregistrement d'un nouvel accès, ce champ n'existe pas !
  "random" : true, // Est-ce que les Q° st random
  "time" : {
   "start" : "timestamp de début",
   "end" : "timestamp de fin"
}
"""


def createAccess(data):

    if data["id_access"] == "none":
        ID = creationID(8)

        while ID in Acces.query.filter_by(id=ID):
            ID = creationID(8)

    nouvelAcces = Acces(
        id=ID,
        nom=data["name"],
        dateDeb=data["time"]["start"],
        dateFin=data["time"]["end"],
        random=data["random"],
        modele=data["id_eval"],
    )
    db.session.add(nouvelAcces)
    db.session.commit()

    return jsonify({"status": "success"})
