class verifText:
    def __init__(self):
        """
        Initialisation,
        Paramètres à compléter
        """
        self.consigne = None
        self.reponse = None
        self.accent = None
        self.pluriel = None
        self.determinant = None
        self.personnes = None
        self.pronomsPersos = None

    def cons(self):
        """
        Je sais pas comment ça doit marcher ça
        Le consigne doit être automatique ou rentrée par le professeur ?
        """
        return

    def rep(self):
        """
        Je sais pas comment ça doit marcher ça
        Ca c'est ton pb Alzalia je touche pas au JSON pour l'instant
        """
        return

    # Paramètres
    # Concrètement je sais pas comment on va gérer ça alors je vais faire plusieurs façon à voir laquelle sera adoptée/la plus adaptée

    # Méthode 1
    def acc(self, bool):
        self.accent = bool

    # Méthode 2
    def true_plur(self):
        self.pluriel = True

    def false_plur(self):
        self.pluriel = False

    # Méthode Pers 1
    def pers(
        self, lBool
    ):  # lBool est une liste de True ou False pour choisir pour chaque personne si elle est demandée ou pas
        self.personnes = lBool

    # Méthode Pers 2
    def pers(
        self, lPers
    ):  # lPers est une liste de 1 à 6 str, chacun une personne différente pour choisir les personnes à utiliser
        self.personnes = lPers

    # Même que les 2 premières méthodes, à voir laquelle choisir
    # def deter(self):
    #     return

    # def pronP(self):
    #     return
