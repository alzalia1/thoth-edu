# Import libraries
from flask import jsonify
from fonctions.creationID import creationID

# Import app
from appInit import db, User, bcrypt


def signup(data):
    # { "id" : "Bob" ; "mdp" : "mdp" ; "accents" : "é" }
    idUser = creationID(6)

    while idUser in User.query.filter_by(id=idUser):
        idUser = creationID(6)

    newUser = User(
        id=idUser,
        nom=data["id"],
        mdp=bcrypt.generate_password_hash(data["mdp"]).decode("utf-8"),
    )

    user = User.query.filter_by(id=data["id"]).first()

    if user == None:
        db.session.add(newUser)
        db.session.commit()
        return jsonify({"status": "success"})  # Utilisateur créé

    if user.nom == data["id"]:
        return jsonify(
            {"status": "fail", "reason": "utilisateur déjà existant"}
        )  # Identifiant déjà existant

    db.session.add(newUser)
    db.session.commit()

    return jsonify({"status": "success"})  # Utilisateur créé
