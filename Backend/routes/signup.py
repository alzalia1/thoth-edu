# Import libraries

from flask import jsonify

# Import app
from appInit import (db,User,bcrypt)

def signup(data):
    # { "id" : "Bob" ; "mdp" : "mdp" ; "accents" : "é" }
    new_user = User(
        id=data["id"],
        mdp=bcrypt.generate_password_hash(data["mdp"]).decode("utf-8"),
        accents=data["accents"],
    )

    user = User.query.filter_by(username=data["id"]).first()

    if user.id == data["id"]:
        return jsonify({"message": "False"}), 200  # Identifiant déjà existant
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "True"}), 201  # Utilisateur créé