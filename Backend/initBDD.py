import sqlite3

conn = sqlite3.connect("../database/BDDSite.db")
cur = conn.cursor()


dummyDataProf = [
    ("Mike Clarke", "crjkqkJ1B5Jy6EcA0T2"),
    ("Austin Sparks", "MyDOQTyGIMH"),
    ("Edith Taylor", "ScFMjprUShMxrfpaRs1K"),
    ("Mattie Young", "bECML"),
    ("Loretta Benson", "F0TbsEBNjB2xS"),
]

dummyDataEval = [
    ("UzEKxg", "", "", "Mike Clarke"),
    ("jbsYhI", "", "", "Austin Sparks"),
    ("xwtksE", "", "", "Edith Taylor"),
    ("CZSgWA", "", "", "Loretta Benson"),
    ("UcoMJE", "", "", "Mike Clarke"),
]

dummyDataAcces = [
    ("Katie", "1-7-2036 00:00:00", "11-25-2038 00:00:00", "UzEKxg"),
    ("Carrie", "6-5-2061 00:00:00", "4-20-2104 00:00:00", "UzEKxg"),
    ("Lena", "11-11-2052 00:00:00", "11-6-2122 00:00:00", "UzEKxg"),
    ("Myrtie", "4-23-2100 00:00:00", "7-11-2036 00:00:00", "UzEKxg"),
    ("Milton", "7-15-2111 00:00:00", "5-15-2124 00:00:00", "CZSgWA"),
    ("Kenneth", "5-19-2076 00:00:00", "12-21-2086 00:00:00", "UcoMJE"),
]


cur.execute("CREATE TABLE IF NOT EXISTS Prof(Pseudo TEXT PRIMARY KEY, MdP TEXT)")
cur.execute(
    "CREATE TABLE IF NOT EXISTS Eval(Nom TEXT PRIMARY KEY, cheminHTML TEXT, cheminCSV TEXT, IDProf TEXT, FOREIGN KEY (IDProf) REFERENCES  Prof(Pseudo))"
)
cur.execute(
    "CREATE TABLE IF NOT EXISTS AccesEleve(IDEleve TEXT PRIMARY KEY, dateDeb INT, dateFin INT, Modele TEXT, FOREIGN KEY (Modele) REFERENCES  Eval(Nom))"
)


cur.executemany("INSERT INTO Prof(Pseudo, Mdp) VALUES (?,?)", dummyDataProf)
cur.executemany(
    "INSERT INTO Eval(Nom, cheminHTML, cheminCSV, IDProf) VALUES (?,?,?,?)",
    dummyDataEval,
)
cur.executemany(
    "INSERT INTO AccesEleve(IDEleve, dateDeb, dateFin, Modele) VALUES (?,?,?,?)",
    dummyDataAcces,
)


conn.commit()
conn.close()
