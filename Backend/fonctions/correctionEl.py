from unidecode import unidecode


def touteCombi(question):
    det = question["params"]["determiners"]
    mot = (
        question["params"]["plural"]
        + question["params"]["genre"]
        + [question["answer"]]
    )
    return [(elem1 + elem2).lower() for elem1 in det for elem2 in mot]


def correctionEl(quest, rep):

    print(quest)
    print(rep)

    repAvecPoints = [x for x in rep]
    for i in range(1, len(quest), 4):
        if quest[i]["type"] == "conjugaison":
            tot = len(rep[i + 1]) * len(rep[i + 1][0])
            compt = 0
            if quest[i]["params"]["accent"] == "true":
                for j in range(len(rep[i + 1])):
                    for k in range(len(rep[i + 1][0])):
                        if rep[i + 1][j][k] == quest[i]["answer"]["verbes"]:
                            compt += 1
            else:
                for j in range(len(rep[i + 1])):
                    for k in range(len(rep[i + 1][0])):
                        if unidecode(rep[i + 1][j][k]) == unidecode(
                            quest[i]["answer"]["verbes"][j][k]
                        ):
                            compt += 1
            repAvecPoints[i + 2] = int(quest[i]["params"]["points"]) * round(
                compt / tot, 1
            )
        else:
            if quest[i]["params"]["accent"] == "true":
                if rep[i + 1] in touteCombi(quest[i]):
                    repAvecPoints[i + 2] = int(quest[i]["params"]["points"])
                else:
                    repAvecPoints[i + 2] = 0
            else:
                if rep[i + 1] in [unidecode(x) for x in touteCombi(quest[i])]:
                    repAvecPoints[i + 2] = int(quest[i]["params"]["points"])
                else:
                    repAvecPoints[i + 2] = 0
    return repAvecPoints
