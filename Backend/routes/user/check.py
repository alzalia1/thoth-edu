# Import libraries
from flask import jsonify
import time
import jwt

# Import app
from appInit import secret


def check(data):
    try:
        decoded_jwt = jwt.decode(data["token"], secret, algorithms=["HS256"])
        newToken = jwt.encode(
            {
                "sub": decoded_jwt["sub"],
                "iat": decoded_jwt["iat"],
                "exp": time.time() + 3600,
            },
            secret,
            algorithm="HS256",
        )
        return jsonify({"status": "success", "new": newToken})
    except jwt.ExpiredSignatureError:
        return jsonify({"status": "fail", "reason": "Jeton expiré"})
    except jwt.InvalidTokenError:
        return jsonify({"status": "fail", "reason": "Probleme sur le token"})
