import time


def etatAcces(acces):
    if time.time()*1000 < float(acces.dateDeb):
        return 0
    elif time.time()*1000 > float(acces.dateFin):
        return 2
    return 1
