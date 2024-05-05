# Import libraries
from flask import jsonify

# Import app
from appInit import db, User, bcrypt


def signup(data):
    # { "id" : "Bob" ; "mdp" : "mdp" ; "accents" : "é" }
    newUser = User(
        id=data["id"],
        mdp=bcrypt.generate_password_hash(data["mdp"]).decode("utf-8"),
        accents=str(data["accents"]),
    )

    user = User.query.filter_by(id=data["id"]).first()

    if user == None:
        db.session.add(newUser)
        db.session.commit()
        return jsonify({"status": "success"})  # Utilisateur créé

    if user.id == data["id"]:
        return jsonify(
            {"status": "fail", "reason": "utilisateur déjà existant"}
        )  # Identifiant déjà existant

    db.session.add(newUser)
    db.session.commit()

    return jsonify({"status": "success"})  # Utilisateur créé
