from unidecode import unidecode


def touteCombi(question):
    print(question)
    det = question["params"]["determiner"]
    mot = (
        question["params"]["plural"]
        + question["params"]["genre"]
        + [question["answer"]]
    )
    return [(elem1 + elem2).lower() for elem1 in det for elem2 in mot]


def correctionEl(quest: list, rep: list):
    """"""
    repAvecPoints = [x for x in rep]
    return rep
    for i in range(len(quest)):
        repAvecPoints[i * 5 + 4] = int(quest[i]["params"]["points"])
        if quest[i]["type"] == "conjugaison":
            print(rep[i * 5 : i * 5 + 3])
            tot = len(rep[i * 5 + 2]) * len(rep[i * 5 + 2][0])
            compt = 0
            if quest[i]["params"]["accent"] == "true":
                for j in range(len(rep[i * 5 + 2])):
                    for k in range(len(rep[i * 5 + 2][0])):
                        if rep[i * 5 + 2][j][k] == quest[i]["answer"]["verbs"]:
                            compt += 1
            else:
                for j in range(len(rep[i * 5 + 2])):
                    for k in range(len(rep[i * 5 + 2][0])):
                        if unidecode(rep[i * 5 + 2][j][k]) == unidecode(
                            quest[i]["answer"]["verbs"][j][k]
                        ):
                            compt += 1
            repAvecPoints[i * 5 + 3] = int(quest[i]["params"]["points"]) * round(
                compt / tot, 1
            )
        else:
            if quest[i]["params"]["accent"] == "true":
                if rep[i * 5 + 2] in touteCombi(quest[i]):
                    repAvecPoints[i * 5 + 3] = int(quest[i]["params"]["points"])
                else:
                    repAvecPoints[i * 5 + 3] = 0
            else:
                if rep[i * 5 + 2] in [unidecode(x) for x in touteCombi(quest[i])]:
                    repAvecPoints[i * 5 + 3] = int(quest[i]["params"]["points"])
                else:
                    repAvecPoints[i * 5 + 3] = 0
    return repAvecPoints
