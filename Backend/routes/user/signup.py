# Import libraries
from flask import jsonify
import sqlite3

# Import app
from appInit import db, User, bcrypt


def signup(data):
    # { "id" : "Bob" ; "mdp" : "mdp" ; "accents" : "é" }
    new_user = User(
        id=data["id"],
        mdp=bcrypt.generate_password_hash(data["mdp"]).decode("utf-8"),
        accents=data["accents"],
    )

    user = User.query.filter_by(username=data["id"]).first()

    if user.id == data["id"]:
        return (jsonify({"message": "False"}),)  # Identifiant déjà existant

    db.session.add(new_user)
    db.session.commit()

    # conn = sqlite3.connect("../../databse/data.db")
    # cur = conn.cursor()
    # nv_data = (
    #    data["id"],
    #    bcrypt.generate_password_hash(data["mdp"]).decode("utf-8"),
    #    data["accents"],
    # )
    #
    # cur.execute("INSERT INTO User(id, mdp, accents) VALUES (?,?,?)", nv_data)
    # conn.commit()
    # cur.close()
    # conn.close()

    return (jsonify({"message": "True"}),)  # Utilisateur créé
