# Import libraries
from flask import jsonify
import os
import jwt

# Import app
from appInit import db, User, Eval, Acces, secret


def delete_directory(path):
    """Supprime les fichiers puis les dossier du chemin path"""
    for child in os.listdir(path):
        child_path = os.path.join(path, child)
        if os.path.isfile(child_path):
            os.remove(child_path)
        elif os.path.isdir(child_path):
            delete_directory(child_path)
    os.rmdir(path)


def delete(data):
    # Recherche de l'utilisateur
    tokenDecode = jwt.decode(data["token"], secret, algorithms=["HS256"])
    userASuppr = User.query.filter_by(id=tokenDecode["sub"]).first()

    if not userASuppr:
        return jsonify(
            {
                "status": "fail",
                "reason": "L'utilisateur que vous essayez de supprimer n'existe pas",
            }
        )

    # Recherche des tous ses contrôles
    evalsASuppr: list = Eval.query.filter_by(idProf=userASuppr.id).all()

    # Recherche de tous les accès à cette évaluation, y compris ceux terminés
    accesASuppr: list = []
    for eval in evalsASuppr:
        accesASuppr += Acces.query.filter_by(modele=eval.id).all()

    delete_directory(f"/home/debian/thoth-edu/database/evals/{userASuppr.id}")

    for eval in evalsASuppr:
        db.session.delete(eval)
    for acces in accesASuppr:
        db.session.delete(acces)
    db.session.delete(userASuppr)
    db.session.commit()

    return jsonify({"status": "succes", "reason": "none"})
