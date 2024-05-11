def trouverID(question, listeQ):
    """Forme globale de la listeQ : [id1, question1, inutile1, inutile1, id2, question2, etc]"""
    for indice in range(0, len(listeQ), 4):
        if listeQ[indice + 1] == str(question):
            return int(listeQ[indice])
