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
# ! Route pour la bdd (A MODIFIER)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite:////home/ubuntu/thoth-edu/database/data.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
CORS(
    app,
    resources={
        r"/.*": {"origins": ["https://thoth-edu.fr", "https://professeur.thoth-edu.fr"]}
    },
)
db = SQLAlchemy(app)
# Setup the Flask-JWT-extended extension
app.config["JWT_SECRET_KEY"] = "YofkxbEsdL"
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager()
jwt.init_app(app)
# Pour le hashing
bcrypt = Bcrypt(app)


# Création de la classe utilisateur
class User(db.Model):
    id = db.Column(db.String, unique=True, nullable=False, primary_key=True)
    mdp = db.Column(db.String, nullable=False)
    accents = db.Column(db.String)


# Création de la classe eval
class Eval(db.Model):
    id = db.Column(db.String, primary_key=True)
    nom = db.Column(db.String)
    cheminJSON = db.Column(db.String)
    cheminCSV = db.Column(db.String)
    idProf = db.Column(db.String, db.ForeignKey("user.id"), nullable=False)


# Création de la classe acces
class Acces(db.Model):
    id = db.Column(db.String, unique=True, nullable=False, primary_key=True)
    nom = db.Column(db.String, nullable=False)
    dateDeb = db.Column(db.String, nullable=False)
    dateFin = db.Column(db.String, nullable=False)
    modele = db.Column(db.String, db.ForeignKey("eval.id"), nullable=False)


# Création des tables
with app.app_context():
    try:
        db.create_all()
        print("Tables created successfully.")
    except Exception as e:
        print("An error occurred while creating tables:", e)


# Création des fonctions pour JWTManager
@jwt.user_lookup_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id).one_or_none()


@jwt.user_identity_loader
def user_identity(user):
    return user.id
