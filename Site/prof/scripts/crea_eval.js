import { addQuestion, questions, loadFromID, loadFromPending } from "./modules/addQuestions.js";
import { Pconfirm, Palert, Puser_check, Perror } from "../../shared/scripts/modules/utils.js";

// ANCHOR - System to check and refresh user's token !
await Puser_check();

async function page() {
    // ANCHOR - Setting the page
    const username = document.getElementById("username");
    username.textContent = localStorage.getItem("username");

    // ANCHOR - load or not ?
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const evalParam = urlParams.get("eval");
    const evalName = document.getElementById("nom_eval");
    if (!(evalParam == null)) {
        // Loads questions if passed parameter
        await fetch("https://api.thoth-edu.fr/crea/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
            },
            body: JSON.stringify({ id: evalParam }),
        })
            .then((response) => response.json())
            .then((data) => {
                evalName.value = data.eval.name;
                loadFromID(data.eval.questions);
            })
            .catch((error) => Perror("Error on crea/get : " + error));
    } else if (
        localStorage.getItem("evalPending") &&
        localStorage.getItem("evalPending") != "none"
    ) {
        Pconfirm(
            "Une ancienne évaluation mal enregistrée a été détectée. Voulez-vous la recharger ?",
            () => {
                loadFromPending(JSON.parse(localStorage.getItem("evalPending")));
            }
        );
    }

    // ANCHOR - Adding a question
    const addType = document.getElementById("addType");
    const statQuestions = document.getElementById("nbQuestions");

    const addConjugButton = document.getElementById("addConjug");
    addConjugButton.addEventListener("click", () => {
        addQuestion("conjugaison");
        addType.hidden = true;
        statQuestions.textContent = "Nombre de questions : " + questions.length.toString();
    });

    const addTradButton = document.getElementById("addTrad");
    addTradButton.addEventListener("click", () => {
        addQuestion("traduction");
        addType.hidden = true;
        statQuestions.textContent = "Nombre de questions : " + questions.length.toString();
    });

    const addQuestionButton = document.getElementById("addQuestion");
    addQuestionButton.addEventListener("click", () => {
        addType.hidden = false;
    });

    // ANCHOR - Saving
    const saveButton = document.getElementById("save");
    saveButton.addEventListener("click", () => {
        Pconfirm(
            "Vous vous appretez à sauvegarder. Cela vous ramènera sur votre dashboard.",
            () => {
                // Making the correct data format
                if (evalName == "") {
                    Palert("Vous devez indiquer un nom pour l'évaluation");
                } else {
                    let evalData = {
                        name: evalName.value,
                        questions: [],
                    };

                    questions.forEach((question) => {
                        evalData.questions.push(question.eval);
                    });

                    let formData = {
                        eval: evalData,
                        token: localStorage.getItem("jwt-token"),
                    };

                    if (evalParam) {
                        formData.id = evalParam;
                    } else {
                        formData.id = "none";
                    }

                    // Sending data
                    fetch("https://api.thoth-edu.fr/crea/save", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
                        },
                        body: JSON.stringify(formData),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status == "success") {
                                Palert("Évaluation sauvegardée avec succès", () => {
                                    localStorage.removeItem("evalPending");
                                    if (evalParam) {
                                        window.location.href = `https://professeur.thoth-edu.fr/dashboard/controle?e=${evalParam}`;
                                    } else {
                                        window.location.href = `https://professeur.thoth-edu.fr/dashboard`;
                                    }
                                });
                            } else {
                                console.log("pas ok" + data.reason);
                            }
                        })
                        .catch((error) => Perror("Error on crea/save : " + error));
                }
            }
        );
    });

    // ANCHOR - Also the logic for the "dashboard" button
    const backToDashboard = document.getElementById("dashboard");
    backToDashboard.addEventListener("click", () => {
        Pconfirm(
            "Attention ! Vous vous apprêtez à quitter sans sauvegarder ! Confirmez-vous ?",
            () => {
                window.location.href = "https://professeur.thoth-edu.fr/dashboard";
            }
        );
    });
}
await page();
