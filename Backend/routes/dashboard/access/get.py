# Import libraries
import csv
import json
from flask import jsonify

# Import app
from appInit import Acces

# return jsonify({ "status" : "success" })
# return jsonify({ "status" : "fail", "reason" : "" })


def get(data):

    acces = Acces.query.filter_by(id=data["id"]).first()
    
    with open(eval.cheminJSON, "r", encoding="utf-8") as fichierEval:
        contenu = fichierEval.read()
        jsonAReturn = json.loads(contenu)
    
    with open(acces.cheminCSV, "r", encoding="utf-8") as fichierEval:
        lecteur_csv = csv.reader(fichierEval, delimiter=",")
        next(lecteur_csv)
        listeQuestions = list(lecteur_csv)
        
    listeRep = [ {"name": listeQuestions[i][0], "id": listeQuestions[i][1], "note": int(listeQuestions[i][3])/int(listeQuestions[i][4]), "answered_at": listeQuestions[i][2]} for i in range(len(listeQuestions)) ]
    
    listeNotes = [ listeRep[i]["note"] for i in range(len(listeRep)) ]
    
    data = {"access": jsonAReturn,
            "mark": sum(listeNotes)/len(listeNotes),
            "ans": listeRep}
    
    return jsonify(data)
