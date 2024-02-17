class HtmlParams:
    def __init__(self, class_name, _id):
        self.class_name = class_name
        self.id = _id


class MainParams:
    def __init__(self, accent, pluriel, determinant, personnes, pronoms_persos):
        self.accent = accent
        self.pluriel = pluriel
        self.determinant = determinant
        self.personnes = personnes
        self.pronoms_persos = pronoms_persos


class VerifTexte:
    def __init__(self, consigne, reponseProf, reponseEleve, html_params, main_params):
        self.consigne = consigne
        self.reponseProf = reponseProf
        self.reponseEleve = reponseEleve
        self.html_params = HtmlParams(**html_params)
        self.main_params = MainParams(**main_params)
