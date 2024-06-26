# Import libraries
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

# Import app
from appInit import app, db, User, bcrypt


def delete(data):
    userASuppr = User.query.filter_by(id=get_jwt_identity(data["token"])).first()
    
    if not userASuppr :
        return jsonify({"status": "fail", "reason": "utilisateur inexistant"})
    
    db.session.delete(userASuppr)
    db.session.commit()

    return jsonify({"status": "succes", "reason": "none"})
    
