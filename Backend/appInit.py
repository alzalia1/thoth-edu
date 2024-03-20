"""
Fichier de définition de l'app, de la db et d'autres classes utiles.
"""
# Import libraries
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
import os

app = Flask(__name__)
# Route pour la bdd (A MODIFIER)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////home/ubuntu/database/data.db"
CORS(app, origins=["https://thoth-edu.fr", "https://professeur.thoth-edu.fr"])
db = SQLAlchemy(app)
# Setup the Flask-JWT-extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
# Pour le hashing
bcrypt = Bcrypt(app)


# Création de la classe utilisateur
class User(db.Model):
    id = db.Column(db.String, unique=True, nullable=False, primary_key=True)
    mdp = db.Column(db.String, nullable=False)
    accents = db.Column(db.String)


# Création de la classe eval
class Eval(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom = db.Column(db.String, nullable=False)
    cheminJSON = db.Column(db.String)
    cheminCSV = db.Column(db.String)
    idProf = db.Column(db.String, db.ForeignKey("user.id"), nullable=False)


# Création de la classe acces
class Acces(db.Model):
    id = db.Column(db.String, unique=True, nullable=False, primary_key=True)
    dateDeb = db.Column(db.String, nullable=False)
    dateFin = db.Column(db.String, nullable=False)
    modele = db.Column(db.String, db.ForeignKey("eval.id"), nullable=False)


# Création des tables
"""
with app.app_context():
    try:
        db.create_all()
        print("Tables created successfully.")
    except Exception as e:
        print("An error occurred while creating tables:", e)
"""


# Sert à l'exemple save-json uniquement, peut-être supprimé n'importe quand.
# Ne pas oublier de supprimer l'import de data_path dans main.py !
script_dir = os.path.dirname(os.path.realpath(__file__))
data_path = os.path.join(script_dir, "data.json")
