# main.py

# Pour créer une nouvelle route (accessible via https://api.thoth-edu.fr/{nom de la route}), utiliser la structure suivante :

# @app.route("/{nom de la route}")
# def {nom de la fonction associée}({arguments ?}):

#     $$ contenu de la fonction

#     $$ création d'un message à retourner

#     return message

# Il est préférable que la fonction réelle s'éxécute dans un fichier de route (voir le dossier routes)

from flask import Flask, request, jsonify, session
import json
from flask_cors import CORS
import os
import routes as r
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    create_access_token,
    JWTManager,
    jwt_required,
    get_jwt_identity,
)
from flask_bcrypt import Bcrypt

app = Flask(__name__)
# Route pour la bdd (A MODIFIER)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///../database/data.sqlite3"
CORS(app, origins=["https://thoth-edu.fr", "https://professeur.thoth-edu.fr"])
db = SQLAlchemy(app)
# Setup the Flask-JWT-extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)
# Pour le hashing
bcrypt = Bcrypt(app)

# Get the directory of the current script
script_dir = os.path.dirname(os.path.realpath(__file__))

# Construct the path to data.json
data_path = os.path.join(script_dir, "data.json")


# Création de la classe utilisateur
class User(db.Model):
    id = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    mdp = db.Column(db.String(120), unique=False, nullable=False)
    accents = db.Column(db.String(200))


@app.route("/")
def home():
    return (
        "Hello T.T Vous êtes bien arrivé sur la page 'home' du système d'API ThothEdu !"
    )


@app.route("/save-json", methods=["POST"])
def save_json():
    data = request.get_json()

    try:
        with open(data_path, "w") as json_file:
            json_file.write(json.dumps(data, indent=2))
        message = "Données sauvegardées avec succès !"
    except Exception as e:
        message = (
            f"Une erreur s'est produite lors de la sauvegarde des données : {str(e)}"
        )

    response = jsonify({"message": message})

    return response


@app.route("/user/signin", methods=["POST"])
def inscription():
    data = request.get_json()
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


@app.route("/user/login", methods=["GET"])
def connexion():
    data = request.get_json()
    user = User.query.filter_by(username=data["id"]).first()

    if not user or user.mdp != bcrypt.generate_password_hash(data["mdp"]).decode(
        "utf-8"
    ):
        return (
            jsonify({"message": "False"}),
            401,
        )  # MdP erroné ou identifiant inexistant

    access_token = create_access_token(identity=user)
    return jsonify(access_token=access_token)
