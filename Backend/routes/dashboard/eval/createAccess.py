# Import libraries
from flask import jsonify
from random import randint

# Import app
from appInit import Acces, db

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })

listeID = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
]


def creationID():
    id = ""
    while len(id) < 8:
        id = id + listeID[randint(0, len(listeID) - 1)]
    return id


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
        ID = creationID()

        while ID in Acces.query.filter_by(id=ID):
            ID = creationID()

    else:
        ID = data["id_access"]

    nouvelAcces = Acces(
        id=ID,
        nom=data["name"],
        dateDebb=data["time"]["start"],
        dateFin=data["time"]["end"],
        random=data["random"],
        modele=data["id_eval"],
    )

    db.session.add(nouvelAcces)
    db.session.commit()

    return jsonify({"status": "success"})
