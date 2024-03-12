"""
Fichier de définition de l'app, de la db et d'autres classes utiles.
"""

# Import libraries
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import os

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

# Création de la classe utilisateur
class User(db.Model):
    id = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    mdp = db.Column(db.String(120), unique=False, nullable=False)
    accents = db.Column(db.String(200), unique=False, nullable=True)


# Sert à l'exemple save-json uniquement, peut-être supprimé n'importe quand.
# Ne pas oublier de supprimer l'import de data_path dans main.py !
script_dir = os.path.dirname(os.path.realpath(__file__))
data_path = os.path.join(script_dir, "data.json")