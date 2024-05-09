import time


def etatAcces(acces):
    if time.time() < int(acces.dateDeb):
        return 0
    elif time.time() > int(acces.dateFin):
        return 2
    return 1
