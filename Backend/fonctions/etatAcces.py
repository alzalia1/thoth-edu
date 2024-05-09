import time


def etatAcces(acces):
    if time.time() < float(acces.dateDeb):
        return 0
    elif time.time() > float(acces.dateFin):
        return 2
    return 1
